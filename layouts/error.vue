<template>
  <section class="error-page">
    <h1 class="title">{{error.statusCode}}</h1>
    <nuxt-link to="/" class="button"></nuxt-link>
  </section>
</template>

<script>
export default {
  props: ['error']
}
</script>

<style lang="scss" scoped>
.error-page {
  text-align: center;
}
.title {
  margin-top: 30px;
}
.button {
  margin-top: 20px;
}
</style>