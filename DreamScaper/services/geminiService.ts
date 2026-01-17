// DreamScaper/services/geminiService.ts

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

type GenerateResponse = {
  image: string;   // data URL
  used?: number;
  limit?: number;
  weekKey?: string;
  error?: string;
};

export async function generateLandscapeVisualization(
  imageBase64: string,
  prompt: string,
  styleModifier?: string,
  email?: string
): Promise<string> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email || "demo@dreamscapers.app",
      prompt,
      styleModifier: styleModifier || "",
      imageBase64,
    }),
  });

  // IMPORTANT: don’t assume JSON — read text first
  const text = await res.text();

  let data: GenerateResponse | null = null;
  try {
    data = JSON.parse(text);
  } catch {
    // Not JSON (often Vercel plain-text/HTML error). Show the real response snippet.
    const snippet = text?.slice(0, 200) || "";
    throw new Error(
      `Server returned non-JSON (${res.status}). ${snippet}`
    );
  }

  if (!res.ok) {
    throw new Error(data?.error || `Server error (${res.status})`);
  }

  if (!data.image) {
    throw new Error("No image returned from server.");
  }

  return data.image;
}
