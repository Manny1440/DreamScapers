// DreamScaper/services/geminiService.ts

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file); // returns "data:image/...;base64,...."
  });
}

export async function generateLandscapeVisualization(
  imageBase64: string,
  prompt: string,
  styleModifier: string
) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageBase64,
      prompt: `${prompt}. ${styleModifier}`,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Generation failed');
  return data.image;
}
