<script lang="ts" setup></script>

<template>
  <section>
    <p>anchor elements</p>
    <nav><a href="/">Home</a> | <a href="/movies">Movies</a></nav>
  </section>
  <section>
    <p>NuxLink</p>
    <nav>
      <nuxt-link to="/">Home</nuxt-link> |
      <nuxt-link to="/movies">Movies</nuxt-link> |
      <nuxt-link to="https://vueschool.io/courses" target="_blank"
        >VueSchool</nuxt-link
      >
    </nav>
  </section>
  <h1>Page: Movies</h1>
</template>

<style scoped></style>
