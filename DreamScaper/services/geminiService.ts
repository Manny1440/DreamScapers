export async function generateLandscapeVisualization(
  imageBase64: string,
  prompt: string,
  styleModifier: string
) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageBase64,
      prompt: `${prompt}. ${styleModifier}`,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Generation failed');
  }

  const data = await res.json();
  return data.image;
}
