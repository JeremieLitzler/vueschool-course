import { ref } from 'vue';
import { defineStore } from 'pinia';
import useFirebase from '@/helpers/fireBaseConnector';
import type GenericMutationRequest from '@/types/GenericMutationRequest';
import type GenericFetchRequest from '@/types/GenericFetchRequest';
import type WithId from '@/types/WithId';
import type GenericFindRequest from '@/types/GenericFindRequest';
import type GenericFetchRequestMany from '@/types/GenericFetchRequestMany';
import type GenericFetchRequestAll from '@/types/GenericFetchRequestAll';

export const useCommonStore = defineStore('CommonStore', () => {
  //STATE
  /**
   * The flag indicating we are fetching something.
   */
  const fetching = ref(false);

  //ACTIONS
  /**
   * Update the flag fetching the data
   */
  const updateFetching = () => {
    // console.log('fetching was', fetching.value);
    fetching.value = !fetching.value;
    // console.log('fetching is', fetching.value);
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
    if (item) {
      console.log(
        `⚡found item in pinia (store: ${request.collection}, id: ${request.id}) on firebase⚡`
      );
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
    console.log(`store has ${targetStore.value.length} items`);

    if (targetStore.value.length > 0) {
      console.log(`⚡ found categories in store ⚡`);
      return new Promise((resolve) => {
        resolve(targetStore.value);
      });
    }
    console.log(`🚨 fetching categories from firestore 🚨`);
    return new Promise((resolve) => {
      useFirebase()
        .getDocs(useFirebase().collection(useFirebase().db, collection))
        .then((querySnapshot) => {
          //console.log("from firestore > querySnapshot: ", querySnapshot);
          // console.log("from firestore > querySnapshot.docs: ", querySnapshot.docs);
          const items = querySnapshot.docs.map((doc) => {
            //console.log("from firestore > doc: ", doc.id, doc.data());
            const item = { id: doc.id, ...doc.data() };
            //console.log("category created: ", category);
            //commit("setItem", { source: "categories", item: item });
            _setItem({ targetStore, item });
            return item as T;
          });
          //console.log(`got from firestore > in ${collection}:`, items);
          resolve(items);
        });
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
    return new Promise((resolve) => {
      console.log(
        `🚨fetching a item (collection: ${collection}, id: ${id}) on firebase🚨`
      );
      useFirebase().onSnapshot(
        useFirebase().doc(useFirebase().db, collection, id),
        (responseDoc) => {
          //console.log("from firestore > responseDoc: ", responseDoc);
          //console.log("from firestore > responseDoc.data: ", responseDoc.data());
          //console.log("from firestore > responseDoc.ref: ", responseDoc.ref);
          const item = { ...responseDoc.data(), id: responseDoc.id };
          // console.log(`returned from firestore > from ${collection}:`, item);
          _setItem({ targetStore: targetStore, item });
          resolve(item as T);
        }
      );
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
   * Note: Not exposed to the outside.
   *
   * @param mutationReq A GenericMutationRequest of T having at least the property 'id'
   */
  const _setItem = <T extends WithId>({
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

  return {
    fetching,
    updateFetching,
    fetchItem,
    fetchSomeItems,
    fetchAllItems,
  };
});
