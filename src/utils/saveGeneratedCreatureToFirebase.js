import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

export async function saveGeneratedCreatureToFirebase(userId, barcode, creatureData) {
  const normalRef = ref(storage, `created_sprites/${barcode}_normal.png`);
  const shinyRef = ref(storage, `created_sprites/${barcode}_shiny.png`);

  const [normalBlob, shinyBlob] = await Promise.all([
    fetch(creatureData.normalSprite).then(r => r.blob()),
    fetch(creatureData.shinySprite).then(r => r.blob()),
  ]);

  await uploadBytes(normalRef, normalBlob);
  await uploadBytes(shinyRef, shinyBlob);

  const normalUrl = await getDownloadURL(normalRef);
  const shinyUrl = await getDownloadURL(shinyRef);

  const docRef = doc(db, 'codex_creatures', barcode);
  await setDoc(docRef, {
    barcode,
    name: creatureData.name,
    normalSprite: normalUrl,
    shinySprite: shinyUrl,
    createdBy: userId,
    timestamp: Date.now(),
  });
}