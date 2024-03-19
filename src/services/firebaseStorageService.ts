import { firebaseApp } from '@/services/fireBaseConnector';
import {
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
  StorageReference,
} from 'firebase/storage';

import type FirebaseStorageAddImageRequest from '@/types/FirebaseStorageAddImageRequest';
import FirebaseStorageResponse from '@/types/FirebaseStorageResponse';
import { NotificationType } from '@/enums/NotificationType';
import { FirebaseError } from 'firebase/app';

export default function firebaseStorageService() {
  const _getStorageBucket = (url: string) => {
    return ref(getStorage(firebaseApp), url);
  };
  const _uploadToStorageBucket = (
    bucketRef: StorageReference,
    imageBlob: Blob
  ) => {
    return uploadBytes(bucketRef, imageBlob);
  };
  const _getImageURL = (snapshotRef: StorageReference) => {
    const urlPromise = getDownloadURL(snapshotRef);
    return urlPromise;
  };

  const uploadImageToStorage = async ({
    userId,
    image = null,
  }: FirebaseStorageAddImageRequest): Promise<FirebaseStorageResponse> => {
    console.log();

    if (!image)
      return {
        url: null,
        notification: {
          message: 'No image provided. Your avatar will use a placeholder',
          type: NotificationType.Info,
        },
      };
    try {
      const storageBucket = _getStorageBucket(
        `uploads/${userId}/images/${Date.now()}-${
          (image as File).name || 'random-image'
        }`
      );
      const snapshot = await _uploadToStorageBucket(storageBucket, image);
      const url = await _getImageURL(snapshot.ref);
      return {
        url,
        notification: {
          message: `The image was successfully saved`,
          type: NotificationType.Success,
        },
      };
    } catch (error) {
      return {
        url: null,
        notification: {
          message: `Failed to upload image (${(error as FirebaseError).code})`,
          type: NotificationType.Error,
        },
      };
    }
  };

  const deleteFile = (url: string) => {
    console.log('deleteFile>url', url);
    const fileRef = _getStorageBucket(url);
    deleteObject(fileRef);
  };
  return {
    uploadImageToStorage,
    deleteFile,
  };
}
