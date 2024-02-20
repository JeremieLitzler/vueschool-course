<template>
  <div class="col-full text-center">
    <h1>You can't do that, sorry.</h1>
    <p>The page requested is off limit... ⛔</p>
    <router-link :to="{ name: 'TheHome' }">Back to a safe place</router-link>
  </div>
</template>
