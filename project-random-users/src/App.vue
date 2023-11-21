<template>
  <AppUserList>
    <template #title>
      <h1>An awesome user list</h1>
    </template>
    <template #loading>
      <AppSpinner />
    </template>
    <template #additional-user-info="{item}">
      <a :href="'mailto:' + item.email"> {{ item.email }} </a><br />
      <a :href="'tel:' + item.phone">
        {{ item.phone }}
      </a>
    </template>
  </AppUserList>
</template>

<script>
  import AppUserList from "@/components/AppUserList";
  import AppSpinner from "@/components/AppSpinner";

  export default {
    components: {
      AppUserList,
      AppSpinner,
    },
  };
</script>
