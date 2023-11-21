<template>
  <div>
    <h1>User list project</h1>
    <div class="user-lists">
      <AppUserList>
        <template #title>
          <h2>An awesome user list</h2>
        </template>
        <template #loading>
          <AppSpinner />
        </template>
        <template #additional-user-info="{userObj}">
          <a :href="'mailto:' + userObj.email"> {{ userObj.email }} </a><br />
          <a :href="'tel:' + userObj.phone">
            {{ userObj.phone }}
          </a>
        </template>
      </AppUserList>
      <!-- <AppUserList>
        <template #title>
          <h2>Another awesome list with the country of some users</h2>
        </template>
        <template #userinfo="{user}">
          <pre>
          {{ user.location.country  }}
        </pre
          >
        </template>
        <template #loading>
          <AppSpinner />
        </template>
      </AppUserList> -->
      <AppUserList>
        <template #title>
          <h2>A final list with the whole component as a slot</h2>
        </template>
        <template #userlist="{userlist, usercount}">
          User count: {{ usercount }}
          <AppUserCardsList :userlist="userlist" />
        </template>
        <template #loading>
          <AppSpinner />
        </template>
      </AppUserList>
    </div>
  </div>
</template>

<script>
  import AppUserList from "@/components/AppUserList";
  import AppSpinner from "@/components/AppSpinner";
  import AppUserCardsList from "@/components/AppUserCardsList";
  export default {
    components: {
      AppUserList,
      AppSpinner,
      AppUserCardsList
    },
  };
</script>
