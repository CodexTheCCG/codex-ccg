export async function generateSpritesFromPrompt(prompt) {
  const normalPrompt = prompt;
  const shinyPrompt = `${prompt}, same design but golden and yellow color scheme, pixel art`;

  const [normalUrl, shinyUrl] = await Promise.all([
    generateImage(normalPrompt),
    generateImage(shinyPrompt),
  ]);

  const normalBlob = await (await fetch(normalUrl)).blob();
  const shinyBlob = await (await fetch(shinyUrl)).blob();

  return { normalImageBlob: normalBlob, shinyImageBlob: shinyBlob };
}

async function generateImage(prompt) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // Put this in .env
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    }),
  });

  const data = await res.json();
  return data.data[0].url;
}
