import { defineComponent, inject, ref, computed } from "vue";

const MenuItem = defineComponent({
  setup(_, { slots, attrs }) {
    const menu = inject("menu");
    const li = ref(null);

    const val = computed(() => li?.value?.textContent ?? "");

    const api = computed(() => menu.api.value);

    // If the item is active
    const active = computed(() => menu?.selectedId?.value === val?.value);
    return () => (
      <li ref={li} {...api.value.getItemProps({ id: val.value })} {...attrs}>
        {() => slots?.default?.({ active: active.value })}
      </li>
    );
  },
});

export default MenuItem;
