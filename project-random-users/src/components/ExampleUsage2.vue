<template>
  <AppUserList>
    <template #title>
      <h2>Another awesome list with the country of some users</h2>
    </template>
    <!-- 
      AppUserList declares a slot named "userinfo"

      It accepts a slot prop which is named "user".
    -->
    <template #userinfo="{user}">
      <pre>
          {{ user.location.country  }}
        </pre
      >
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
      }
  }
</script>

<style scoped></style>
