<template>
  <AppUserList>
    <template #title>
      <h2>A last list with the whole component as a slot and actions</h2>
    </template>
    <!-- 
      AppUserList declares a slot named "userlist"

      It accepts two slot props which are named:
        - "userlist" (an array), 
        - "usercount" (a integer) 
        - and "removeInComponentSlot" (a function present in the AppUserList component).
    -->
    <template #userlist="{userlist, usercount, removeInComponentSlot}">
      User count: {{ usercount }}
      <AppUserCardsList :userlist="userlist">
        <template #additional-user-info="{userObj}">
          <!--
            When cliking on the AppButton, the event is propagated to the parent, 
            e.g AppUserList component method of the name of the slot prop.

            In this case, it also expects an object that is the slot prop "userObj" from the named slot "additional-user-info".
            Warning: "userObj" is found "AppUserCardsList" component. 
          -->
          <AppButton @click="removeInComponentSlot(userObj)">
            <!-- It is important to have the v-on="$listeners" on the button element so that the parent (e.g. AppUserList) receives the event -->
            remove ❌
          </AppButton>
        </template>
      </AppUserCardsList>
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
  import AppButton from "@/components/AppButton";
  export default {
      components: {
          AppUserList,
          AppUserCardsList,
          AppSpinner,
          AppButton,
      }
  }
</script>

<style scoped></style>
