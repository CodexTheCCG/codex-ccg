import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { generateSpritesFromPrompt } from './generateSpritesFromPrompt';

export async function handleBarcodeScan(barcode, userId) {
  const prompt = generatePromptFromBarcode(barcode);
  const { normalImageBlob, shinyImageBlob } = await generateSpritesFromPrompt(prompt);

  const normalRef = ref(storage, `sprites/${userId}/${barcode}_normal.png`);
  const shinyRef = ref(storage, `sprites/${userId}/${barcode}_shiny.png`);

  await uploadBytes(normalRef, normalImageBlob);
  await uploadBytes(shinyRef, shinyImageBlob);

  const normalUrl = await getDownloadURL(normalRef);
  const shinyUrl = await getDownloadURL(shinyRef);

  const creatureData = {
    userId,
    barcode,
    prompt,
    name: getNameFromPrompt(prompt),
    normalSprite: normalUrl,
    shinySprite: shinyUrl,
    timestamp: Date.now()
  };

  await setDoc(doc(db, "creatures", barcode), creatureData);
  return creatureData;
}

function generatePromptFromBarcode(barcode) {
  const themes = [
    "abyssling from the void",
    "ember imp with burning eyes",
    "glowing moss creature of the forest",
    "frozen serpent made of ice shards",
    "celestial angel-beast with radiant wings",
    "toxic sludge monster with oozing eyes",
    "mechanical scarab powered by light",
    "shadow fox with ethereal flames",
    "crystalline golem with glowing core",
    "ancient root walker with moss armor"
  ];
  const index = parseInt(barcode.slice(-2)) % themes.length;
  return `pixel art creature, ${themes[index]}`;
}

function getNameFromPrompt(prompt) {
  const lastWords = prompt.split(", ").pop().split(" ");
  return lastWords.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("");
}
