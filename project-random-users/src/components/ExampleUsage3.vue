<template>
  <AppUserList>
    <template #title>
      <h2>A list using the whole component as a slot</h2>
    </template>
    <!-- 
      AppUserList declares a slot named "userlist"

      It accepts two slot props which are named "userlist" and "usercount".
    -->
    <template #userlist="{userlist, usercount}">
      User count: {{ usercount }}
      <!--
       AppUserCardsList accepts a prop that the slot prop from above. 
      -->
      <AppUserCardsList :userlist="userlist" />
    </template>
    <template #loading>
      <AppSpinner />
    </template>
  </AppUserList>
</template>

<script>
  import AppUserList from "@/components/AppUserList";
  import AppUserCardsList from "@/components/AppUserCardsList";
  import AppSpinner from "@/components/AppSpinner";
  export default {
      components: {
          AppUserList,
          AppUserCardsList,
          AppSpinner,
      }
  }
</script>

<style scoped></style>
