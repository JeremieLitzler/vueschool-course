<template>
  <div>
    <select name="options" id="options" v-model="selected">
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{option.label }}
      </option>
    </select>
    <AppUserList>
      <template #title>
        <h2>A last list with the whole component as a slot and actions</h2>
      </template>
      <template #userlist="{userlist}">
        <AppUserCardsList :userlist="userlist">
          <template v-slot:[selected]="{text}">
            <h3>{{ text }}</h3>
          </template>
        </AppUserCardsList>
      </template>
      <template #loading>
        <AppSpinner />
      </template>
    </AppUserList>
  </div>
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
      },
      data() {
        return {
          selected: "first",
          options: [{value: "first", label: "First name"}, {value: "last", label: "Last name"}, {value: "full", label: "Full name"}, {value: "fullWithTitle", label: "Full name with title"}]
        }
      }
  }
</script>

<style scoped></style>
