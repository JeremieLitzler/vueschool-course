<template>
  <div>
    <h1>User list project</h1>
    <div>
      The list below use the same
      <pre>AppUserList</pre>
      component but, thanks to slots in that component, we are able to keep the
      commun functionnalities and render the list very differently!
    </div>
    <div class="user-lists">
      <!-- <ExampleUsage1 />
      <ExampleUsage2 />
      <ExampleUsage3 />
      <ExampleUsage4 /> -->
      <ExampleUsage5 />
    </div>
  </div>
</template>

<script>
  // import ExampleUsage1 from "@/components/ExampleUsage1";
  // import ExampleUsage2 from "@/components/ExampleUsage2";
  // import ExampleUsage3 from "@/components/ExampleUsage3";
  // import ExampleUsage4 from "@/components/ExampleUsage4";
  import ExampleUsage5 from "@/components/ExampleUsage5";
  export default {
    components: {
      // ExampleUsage1,
      // ExampleUsage2,
      // ExampleUsage3,
      // ExampleUsage4,
      ExampleUsage5,
    },
    methods: {
    }
  };
</script>
