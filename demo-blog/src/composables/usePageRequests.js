import { computed, reactive } from 'vue';

//activeRequests is out of the composable to avoid it to be redefined on each components using it.
//this creates a type of global state management.
const activeRequests = reactive([]);

export default function userPageRequests() {
  const isLoading = computed(() => !!activeRequests.length);
  //Same tehe following is the same as above:
  //const isLoading = computed(() => (activeRequests.length ? true : false));

  const makeRequest = async (url) => {
    //knowing the index, it will be easier to remove the item in the end
    const index = activeRequests.length;
    //push the url to the activeRequests array...
    activeRequests[index] = url;

    const response = await fetch(url).catch((err) => alert(err));
    const data = await response.json();

    //... and remove it from the activeRequests array after the request is fulfilled.
    activeRequests.splice(index, 1);
    //if fetch failed, still remove it from the activeRequests array + add an alert
    return data;
  };
  return { isLoading, makeRequest };
}
