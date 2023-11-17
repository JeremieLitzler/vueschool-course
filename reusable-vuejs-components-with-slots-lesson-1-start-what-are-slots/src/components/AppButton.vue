<template>
  <button>
    <Icon v-if="showIcon" />
    {{ text }}
  </button>
</template>

<script>
  import Icon from "@/components/Icon";

  export default {
      props: {
          "text" : {
            type: String
          },
          "showIcon": {
            type: Boolean
          }
      },
      components: {
        Icon
      }
  }
</script>

<style scoped></style>
