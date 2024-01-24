import { ref, reactive } from 'vue';

export function PiniaHistoryPlugin({ pinia, app, store, options }) {
  if (!options.historyEnabled) return;

  const storeHistory = reactive([]);
  const futureStore = reactive([]);
  //This is necessary to prevent the $subscribe function to run when we are undoing.
  const doingHistory = ref(false);

  storeHistory.push(JSON.stringify(store.$state));

  const undo = () => {
    //Cannot undo if the storeHistory has only the initial value
    if (storeHistory.length === 1) {
      console.log('Nothing to undo...');
      return;
    }

    console.log('Undoing to previous state mutation...');
    doingHistory.value = true;
    futureStore.push(storeHistory.pop());
    store.$state = JSON.parse(storeHistory.at(-1));
    doingHistory.value = false;
  };
  const redo = () => {
    console.log('Redoing to previous state mutation...');
    const latestState = futureStore.pop();
    if (!latestState) {
      console.log('No redo possible because the future is empty...');
      return;
    }
    doingHistory.value = true;
    storeHistory.push(latestState);
    store.$state = JSON.parse(latestState);
    doingHistory.value = false;
  };

  store.$subscribe((mutation, state) => {
    if (!doingHistory.value) {
      storeHistory.push(JSON.stringify(state));
      //reset the futureStore not with [] because it is reactive
      //instead, the splice method clears the items from it.
      futureStore.splice(0, futureStore.length);
    }
  });

  return {
    storeHistory,
    futureStore,
    undo,
    redo,
  };
}
