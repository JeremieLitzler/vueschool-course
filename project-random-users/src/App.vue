<template>
  <AppUserList
    :emailinfo="user => user.email"
    :phonenumberinfo="user => user.phone"
  >
    <template #title>
      <h1>An awesome user list</h1>
    </template>
    <template #loading>
      <AppSpinner />
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
