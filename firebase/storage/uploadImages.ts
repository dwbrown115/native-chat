import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import firebase_app from "../config";

export default async function uploadImages(
  images: File[],
  collection: string,
  listing: string,
): Promise<string[]> {
  const storage = getStorage(firebase_app);
  const promises = images.map((image) => {
    const storageRef = ref(storage, `${collection}/${listing}/${image.name}`);
    return uploadBytes(storageRef, image).then((snapshot) => {
      return getDownloadURL(snapshot.ref);
    });
  });

  return Promise.all(promises);
}
