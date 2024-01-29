import * as menu from "@zag-js/menu";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { computed, ref, provide, defineComponent } from "vue";
import './menu.css'

const Menu = defineComponent({
  setup(_, { slots, attrs }) {
    const selectedId = ref("");
    const [state, send] = useMachine(
      menu.machine({
        id: "menu",
        "aria-label": "File",
        onSelect(selected) {
          selectedId.value = selected.value;
        },
        closeOnSelect: false,
      })
    );
    const api = computed(() => menu.connect(state.value, send, normalizeProps));

    provide("menu", { api, selectedId });

    const close = () => api.value.close();
    const open = () => api.value.open();

    return () => <div  {...attrs}>{ () => slots?.default?.({ open, close }) }</div>;
  },
});

export default Menu;
