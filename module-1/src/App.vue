<template>
  <AppLayout>
    <template #header>Slots are awesome !</template>
    <template #default
      ><!-- unnamed slot -->
      <h1>This is in the main element, which is a unnamed slot</h1>
      <AppButton text="Press me (no slot)" :showIcon="true"></AppButton>
      <AppButtonSlot>
        <Icon />
        Press me (with slot)</AppButtonSlot
      >
    </template>
    <template #footer>Copyright @ VueSchool.io</template>
  </AppLayout>
</template>

<script>
  import AppLayout from "@/components/AppLayout";
  import AppButton from "@/components/AppButton";
  import AppButtonSlot from "@/components/AppButtonSlot";
    import Icon from "@/components/Icon";

  export default {
    components: {
      AppLayout,
      AppButton,
      AppButtonSlot,
      Icon,
    }
  };
</script>

<style>
  button {
    color: white;
    display: flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    border: none;
    text-transform: uppercase;
    font-weight: bold;
    background-color: #41b883;
    border-radius: 0.25rem;
    line-height: 1.5;
    margin: 10px;
  }
</style>
