<template>
  <div class="about-page">
    <div class="title">
      <span class="title-name">关于我</span>
      <span class="line"></span>
    </div>
    <my-comment referId="0"></my-comment>
  </div>
</template>

<script>
import CommentVue from '../components/Comment.vue'
export default {
  name: 'about',
  components: {
    'my-comment': CommentVue
  }
}
</script>

<style lang="scss" scoped>
.about-page {
  width: $container-min-width;
  margin: 0 auto;
}
</style>