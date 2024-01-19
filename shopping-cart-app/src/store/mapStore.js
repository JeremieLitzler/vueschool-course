import { computed } from 'vue';
import { useStore } from 'vuex';

const mapState = () => {
  const store = useStore();
  console.log('mapState > store =', store);
  const state = Object.fromEntries(
    Object.keys(store.state).map((key) => [
      key,
      computed(() => store.state[key]),
    ]),
  );
  console.log('mapState', state);
  return state;
};

const mapGetters = () => {
  const store = useStore();
  console.log('mapGetters > store =', store);

  const getters = Object.fromEntries(
    Object.keys(store.getters).map((getter) => [
      getter,
      computed(() => store.getters[getter]),
    ]),
  );
  console.log('mapGetters', getters);
  return getters;
};

const mapMutations = () => {
  const store = useStore();
  console.log('mapMutations > store =', store);

  const mutations = Object.fromEntries(
    Object.keys(store._mutations).map((mutation) => [
      mutation,
      (value) => store.commit(mutation, value),
    ]),
  );
  console.log('mapMutations', mutations);
  return mutations;
};

const mapActions = () => {
  const store = useStore();
  console.log('mapActions > store =', store);

  const actions = Object.fromEntries(
    Object.keys(store._actions).map((action) => [
      action,
      (value) => store.dispatch(action, value),
    ]),
  );
  console.log('mapActions', actions);
  return actions;
};

export { mapState, mapGetters, mapMutations, mapActions };
