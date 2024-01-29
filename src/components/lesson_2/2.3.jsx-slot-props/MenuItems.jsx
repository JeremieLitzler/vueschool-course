import { inject, computed, defineComponent } from "vue";

const MenuItems = defineComponent({
  setup(_, { slots, attrs }) {
    const menu = inject("menu");
    const api = computed(() => menu.api.value);

    return () => (
      <div {...api.value.positionerProps} {...attrs}>
        <ul {...api.value.contentProps}>{() => slots?.default?.()}</ul>
      </div>
    );
  },
});

export default MenuItems;
