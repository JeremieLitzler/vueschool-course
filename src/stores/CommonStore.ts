import { ref } from 'vue';
import { defineStore } from 'pinia';
import useFirebase from '@/helpers/fireBaseConnector';
import type GenericMutationRequest from '@/types/GenericMutationRequest';
import type GenericFetchRequest from '@/types/GenericFetchRequest';
import type WithId from '@/types/WithId';
import type GenericFindRequest from '@/types/GenericFindRequest';
import type GenericFetchRequestMany from '@/types/GenericFetchRequestMany';
import type GenericFetchRequestAll from '@/types/GenericFetchRequestAll';
import type UiElementNotification from '@/types/UiElementNotification';
import type FirebaseSinglePropQueryRequest from '@/types/FirebaseSinglePropQueryRequest';
import type FirebaseChunkQueryRequest from '@/types/FirebaseChunkQueryRequest';
import type OnSnapshotUnsubscribeListener from '@/types/OnSnapshotUnsubscribeListener';
import useArrayChunckHelper from '@/helpers/arrayChunkHelper';
import firebaseService from '@/services/firebaseService';
import UploadImageToStorage from '@/types/UploadImageToStorageRequest';
import useNotification from '@/composables/useNotification';
import { FirebaseError } from 'firebase/app';
import { NotificationType } from '@/enums/NotificationType';

export const useCommonStore = defineStore('CommonStore', () => {
  //STATE
  /**
   * The flag indicating we are fetching something.
   */
  const appIsReady = ref(false);
  /**
   * List of asynchronous UI elements and their loading state (true = loaded ; false = loading)
   */
  const asyncUiParts = ref<UiElementNotification[]>([]);
  /**
   * Default number of elements to fetch when retrieving many items
   */
  const maxElementsPerFetch = 5;

  const onSnapshotUnsubscribeListeners = ref<OnSnapshotUnsubscribeListener[]>(
    []
  );

  //GETTERS
  const isUiElementReady = (uiElement: string) => {
    const match = asyncUiParts.value.find(
      (item) => item.uiElement === uiElement
    );
    if (match === undefined) {
      //console.log("getters > isUiElementReady (undefined)");
      return true;
    }
    //console.log("getters > isUiElementReady", state.asyncUiParts[uiElement]);
    return match.ready ?? true;
  };

  //ACTIONS
  /**
   * Update the flag fetching the data
   */
  const notifyAppIsReady = () => {
    //console.log('fetching was', fetching.value);
    appIsReady.value = true;
    //console.log('fetching is', fetching.value);
  };

  /**
   * Add a notification that a UI element is being updated.
   *
   * @param notification The UiElementNotification object
   */
  const notifyAsyncUiElementState = ({
    uiElement,
    ready = false,
  }: UiElementNotification) => {
    //console.log("calling notifyUiElementLoading");
    asyncUiParts.value.push({ uiElement, ready });
  };

  /**
   * Reset the async UI element array.
   * @see router > beforeEach guard
   */
  const resetAsyncUiElements = () => {
    //console.log("calling resetUiPartsLoading");
    asyncUiParts.value = [];
  };
  /**
   * Fetch an item in the store first, otherwise in firestore given a collection and an id.
   *
   * @param request A GenericFetchRequest of T having at least the property 'id'
   * @returns A promise of T
   */
  const fetchItem = <T extends WithId>(
    request: GenericFetchRequest<T>
  ): Promise<T> => {
    const item = _findItemInLocalStore<T>({ ...request });
    if (item && !request.reFetch) {
      //console.log(
      //   `🍍found item in pinia (store: ${request.collection}, id: ${request.id}) on firebase🍍`
      // );
      return new Promise((resolve) => resolve(item as T));
    }

    return _makeFetch({ ...request });
  };
  /**
   * Fetch some items given a collection and an array of ids.
   *
   * @param request A GenericFetchRequestMany of T having at least the property 'id'
   * @returns A arry of Promise of T
   */
  const fetchSomeItems = <T extends WithId>({
    targetStore,
    collection,
    ids,
  }: GenericFetchRequestMany<T>): Promise<Awaited<T>[]> => {
    const fetchs = ids.map((id) =>
      fetchItem<T>({ id, targetStore, collection })
    );
    const result = Promise.all(fetchs);
    return result;
  };
  /**
   * Fetch all items in the store if more than 1 found, else fetch firestore for the full list.
   *
   * @param param0 A GenericFetchRequestAll of T having at least the property 'id'
   * @returns A Promise of an array of T
   */
  const fetchAllItems = <T extends WithId>({
    targetStore,
    collection,
  }: GenericFetchRequestAll<T>): Promise<T[]> => {
    //console.log(`store has ${targetStore.value.length} items`);

    if (targetStore.value.length > 0) {
      //console.log(`🍍 found categories in store 🍍`);
      return new Promise((resolve) => {
        resolve(targetStore.value);
      });
    }
    //console.log(`🚨 fetching categories from firestore 🚨`);
    return new Promise((resolve) => {
      useFirebase()
        .getDocs(useFirebase().collection(useFirebase().db, collection))
        .then((querySnapshot) => {
          //console.log("from firestore > querySnapshot: ", querySnapshot);
          //console.log("from firestore > querySnapshot.docs: ", querySnapshot.docs);
          const items = querySnapshot.docs.map((doc) => {
            //console.log("from firestore > doc: ", doc.id, doc.data());
            const item = { id: doc.id, ...doc.data() };
            //console.log("category created: ", category);
            //commit("setItem", { source: "categories", item: item });
            setItem({ targetStore, item });
            return item as T;
          });
          //console.log(`got from firestore > in ${collection}:`, items);
          resolve(items);
        });
    });
  };
  /**
   * Fetch in the firestore documents matching the request
   *
   * @param FirebaseSinglePropQueryRequest The FirebaseSinglePropQueryRequest object
   * @returns The number of records fetched
   */
  const fetchItemsByProp = async <T extends WithId>({
    collectionName,
    targetStore,
    propName,
    propValue,
    orderByProp,
    orderByDirection,
    startAtItem,
  }: FirebaseSinglePropQueryRequest<T>) => {
    const collection = useFirebase().collection(
      useFirebase().db,
      collectionName
    );
    const commonQueryParts = [
      useFirebase().where(propName, '==', propValue),
      useFirebase().orderBy(orderByProp, orderByDirection),
      useFirebase().limit(maxElementsPerFetch),
    ];
    let queryObj = useFirebase().query(collection, ...commonQueryParts);
    if (startAtItem) {
      const postRef = useFirebase().doc(
        useFirebase().db,
        collectionName,
        startAtItem.id
      );
      const lastPost = await useFirebase().getDoc(postRef);
      const constraintsExtended = [
        ...commonQueryParts,
        useFirebase().startAfter(lastPost),
      ];
      queryObj = useFirebase().query(collection, ...constraintsExtended);
    }
    const items = await useFirebase().getDocs(queryObj);
    items.forEach((item) => {
      setItem({
        targetStore,
        item: { ...item.data(), id: item.id },
      });
    });
    return items.docs?.length;
  };
  /**
   * Fetch a given range or page of T items in a list of string identifiers.
   *
   * @param param0 The FirebaseChunkQueryRequest object
   * @returns The list of T objects
   */
  const fetchItemsByChunk = <T extends WithId>({
    targetStore,
    collection,
    ids,
    chunkIndex,
    chunkSize,
  }: FirebaseChunkQueryRequest<T>) => {
    //console.log("actions < fetchItemsByChunk > source", source);
    //console.log("actions < fetchItemsByChunk > ids", ids);
    //console.log("actions < fetchItemsByChunk > chunckIndex", chunckIndex);
    const chuncks = useArrayChunckHelper().chunckIt<string>(chunkSize)(ids);

    //console.log("actions < fetchItemsByChunk > chuncks", chuncks);
    //console.log("actions < fetchItemsByChunk > chunck", chuncks[chunckIndex]);
    return fetchSomeItems({
      targetStore,
      collection,
      ids: chuncks[chunkIndex],
    });
  };
  /**
   * Query firestore in a collection given an item id.
   * Once fetch, the item is set into the targetStore.
   * Note: Not exposed to the outside.
   *
   * @param request A GenericFetchRequest of T having at least the property 'id'
   * @returns A promise of T
   */
  const _makeFetch = <T extends WithId>({
    targetStore,
    id,
    collection,
  }: GenericFetchRequest<T>): Promise<T> => {
    return new Promise(async (resolve) => {
      //console.log(
      //   `🚨fetching a item (collection: ${collection}, id: ${id}) on firebase🚨`
      // );
      if (!id) return resolve({} as T);

      const itemRef = useFirebase().doc(useFirebase().db, collection, id);
      const unsubscribe = useFirebase().onSnapshot(itemRef, (item) => {
        if (!item.exists()) return resolve({} as T);

        const result = { ...item.data(), id: item.id } as T;
        setItem({ targetStore: targetStore, item: result });
        resolve(result);
      });
      appendSnapshotUnsubscribe(unsubscribe);
    });
  };
  /**
   * Find an item in a target store given an id.
   * Note: Not exposed to the outside.
   *
   * @param searchRequest GenericFindRequest of T having at least the property 'id'
   * @returns T or undefined
   */
  const _findItemInLocalStore = <T extends WithId>(
    searchRequest: GenericFindRequest<T>
  ): T | undefined => {
    return searchRequest.targetStore.value.find(
      (element) => element.id === searchRequest?.id
    );
  };
  /**
   * Set an item in a targetStore.
   *
   * @param mutationReq A GenericMutationRequest of T having at least the property 'id'
   */
  const setItem = <T extends WithId>({
    targetStore,
    item,
  }: GenericMutationRequest<T>) => {
    const index = targetStore.value.findIndex(
      (element: T) => element.id === item.id
    );
    if (item.id && index !== -1) {
      targetStore.value[index] = item;
    } else {
      targetStore.value.push(item);
    }
  };

  const appendSnapshotUnsubscribe = (unsubscribe: Function) => {
    //console.log('Running appendSnapshotUnsubscribe...');
    onSnapshotUnsubscribeListeners.value.push({ listener: unsubscribe });
    // console.log(
    //   'onSnapshotUnsubscribeListeners contains',
    //   onSnapshotUnsubscribeListeners.value
    // );
  };
  const runAllSnapshotUnsubscribes = () => {
    //console.log('Running runAllSnapshotUnsubscribes');

    onSnapshotUnsubscribeListeners.value.forEach((unsub) => unsub.listener());
    onSnapshotUnsubscribeListeners.value = [];
  };

  const uploadImageToStorage = async ({
    userId,
    image,
  }: UploadImageToStorage) => {
    try {
      const storageBucket = firebaseService().getStorageBucket(
        `uploads/${userId}/images/${Date.now()}-${
          image!.name || 'random-image'
        }`
      );
      const snapshot = await firebaseService().uploadToStorageBucket(
        storageBucket,
        image
      );
      const avatarUrl = await firebaseService().getImageURL(snapshot.ref);
      return avatarUrl;
    } catch (error) {
      console.error(error);
      useNotification().addNotification({
        message: `Failed to upload image (${(error as FirebaseError).code})`,
        type: NotificationType.Error,
      });
      return null;
    }
  };
  return {
    appIsReady,
    isUiElementReady,
    notifyAppIsReady,
    notifyAsyncUiElementState,
    resetAsyncUiElements,
    runAllSnapshotUnsubscribes,
    fetchItem,
    fetchSomeItems,
    fetchAllItems,
    fetchItemsByProp,
    fetchItemsByChunk,
    setItem,
    uploadImageToStorage,
  };
});
