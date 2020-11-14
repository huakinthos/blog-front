<template>
  <footer>
    <div class="footer">
      <div class="links">
        <time>©{{new Date().getFullYear()}}</time>
        <a href="1628331231@qq.com" _target="_blank">邮箱</a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'my-footer'
};
</script>

<style lang="scss" scoped>
footer {
  display: flex;
  justify-content: flex-end;
  time {
    margin-right: 10px;
  }
}
</style>