import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import { GoogleGenAI } from '@google/genai';

const WEEKLY_LIMIT = 50;

function startOfWeekKeyISO(d = new Date()) {
  // Monday-based week key: YYYY-Www
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = date.getUTCDay() || 7; // Sunday=7
  date.setUTCDate(date.getUTCDate() - day + 1); // Monday
  const year = date.getUTCFullYear();
  const firstJan = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil((((date.getTime() - firstJan.getTime()) / 86400000) + firstJan.getUTCDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing GEMINI_API_KEY on server' });

    const { email, prompt, styleModifier, imageBase64 } = req.body || {};

    if (!email || !prompt || !imageBase64) {
      return res.status(400).json({ error: 'Missing required fields: email, prompt, imageBase64' });
    }

    // ---- 50/week limit (per email) ----
    const weekKey = startOfWeekKeyISO(new Date());
    const usageKey = `usage:${weekKey}:${String(email).toLowerCase()}`;

    const current = (await kv.get<number>(usageKey)) ?? 0;
    if (current >= WEEKLY_LIMIT) {
      return res.status(429).json({
        error: `Weekly limit reached (${WEEKLY_LIMIT}/week). Try again next week.`,
        limit: WEEKLY_LIMIT,
        used: current,
      });
    }

    // increment now (simple + safe approach)
    await kv.set(usageKey, current + 1, { ex: 60 * 60 * 24 * 14 }); // keep ~2 weeks

    // ---- Call Gemini ----
    const ai = new GoogleGenAI({ apiKey });

    // NOTE: Exact model name/payload can vary by SDK version.
    // This is the common pattern: provide prompt + image as inline base64.
    const finalPrompt = styleModifier ? `${prompt}\n\nStyle: ${styleModifier}` : prompt;

    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash-image-generation',
      contents: [
        {
          role: 'user',
          parts: [
            { text: `Generate a realistic high-quality landscape transformation. ${finalPrompt}` },
            {
              inlineData: {
                mimeType: 'image/png',
                data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
              },
            },
          ],
        },
      ],
    });

    // Try to extract an image from the response
    const candidate = result.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData?.data);

    if (!imagePart?.inlineData?.data) {
      return res.status(500).json({ error: 'No image returned from model', raw: result });
    }

    const outMime = imagePart.inlineData.mimeType || 'image/png';
    const outBase64 = imagePart.inlineData.data;
    const dataUrl = `data:${outMime};base64,${outBase64}`;

    return res.status(200).json({
      image: dataUrl,
      used: current + 1,
      limit: WEEKLY_LIMIT,
      weekKey,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Server error' });
  }
}
