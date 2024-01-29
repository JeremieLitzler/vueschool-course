import { inject, computed, defineComponent } from "vue";

const MenuButton = defineComponent({
  setup(_, { slots, attrs }) {
    const menu = inject("menu");
    const api = computed(() => menu.api.value);

    return () => (
      <button {...api.value.triggerProps}>
        {() => slots?.default?.()}
      </button>
    );
  },
});

export default MenuButton;