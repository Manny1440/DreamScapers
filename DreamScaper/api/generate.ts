// DreamScaper/services/geminiService.ts

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file); // "data:image/...;base64,...."
  });
}

export async function generateLandscapeVisualization(
  imageBase64: string,
  prompt: string,
  styleModifier: string,
  email: string
): Promise<string> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      prompt,
      styleModifier,
      imageBase64,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Generation failed');

  return data.image as string; // expected to be a data URL
}
