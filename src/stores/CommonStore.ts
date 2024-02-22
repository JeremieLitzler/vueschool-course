import { ref } from 'vue';
import { defineStore } from 'pinia';
import useFirebase from '@/helpers/fireBaseConnector';
import type GenericMutationRequest from '@/types/GenericMutationRequest';
import type GenericFetchRequest from '@/types/GenericFetchRequest';
import type WithId from '@/types/WithId';
import type GenericFindRequest from '@/types/GenericFindRequest';
import type ManyGenericFetchRequest from '@/types/ManyGenericFetchRequest';

export const useCommonStore = defineStore('CommonStore', () => {
  //STATE
  const fetching = ref(false);

  //ACTIONS
  const updateFetching = () => {
    console.log('fetching is', fetching.value);

    fetching.value = !fetching.value;
  };

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

  const fetchItems = <T extends WithId>({
    source,
    collection,
    ids,
  }: ManyGenericFetchRequest<T>): Promise<Awaited<T>[]> => {
    const fetchs = ids.map((id) => fetchItem<T>({ id, source, collection }));
    const result = Promise.all(fetchs);
    return result;
  };

  const _makeFetch = <T extends WithId>({
    source,
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
          console.log(`returned from firestore > from ${collection}:`, item);
          setItem({ source: source, item });
          resolve(item as T);
        }
      );
    });
  };

  const _findItemInLocalStore = <T extends WithId>(
    searchRequest: GenericFindRequest<T>
  ): T | undefined => {
    return searchRequest.source.value.find(
      (element) => element.id === searchRequest?.id
    );
  };

  const setItem = <T extends WithId>(
    mutationReq: GenericMutationRequest<T>
  ) => {
    const index = mutationReq.source.value.findIndex(
      (element: T) => element.id === mutationReq.item.id
    );
    if (mutationReq.item['id'] && index !== -1) {
      mutationReq.source.value[index] = mutationReq.item;
    } else {
      mutationReq.source.value.push(mutationReq.item);
    }
  };

  return {
    fetching,
    updateFetching,
    fetchItem,
    fetchItems,
  };
});
