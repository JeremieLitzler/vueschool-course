<template>
  <AppUserList>
    <template #title>
      <h2>An awesome user list with a small slot</h2>
    </template>
    <template #loading>
      <AppSpinner />
    </template>
    <!-- 
      AppUserList declares a slot named "additional-user-info"

      It accepts a slot prop which is named "userObj".
    -->
    <template #additional-user-info="{userObj}">
      <a :href="'mailto:' + userObj.email"> {{ userObj.email }} </a><br />
      <!-- <a :href="'tel:' + userObj.phone">
            {{ userObj.phone }}
          </a> -->
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
