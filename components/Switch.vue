<template>
  <section class="switch" :class="{'show': show}">
    <div class="switch-wrapper">
      <div class="switch-icon">
        <div class="com-icon" @click="toggle">
          <i class="iconfont" :class="show ? 'icon-guanbi' : 'icon-switch'"></i>
        </div>
      </div>
      <div class="title">分类列表</div>
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'switch',
  data() {
    return {
      show: false
    }
  },
  methods: {
    toggle() {
      this.show = !this.show
    }
  }
}
</script>

<style lang="scss" scoped>
.switch {
  box-sizing: border-box;
  &.show {
    .switch-wrapper {
      transform: translateZ(0);
    }
  }
  .switch-wrapper {
    position: fixed;
    right: 0;
    bottom: 0;
    top: $header-height;
    width: 280px;
    background: teal;
    transform: translate3d(100%, 0, 0);
    transition: all .3s;
    .switch-icon {
      position: absolute;
      left: -40px;
      width: 30px;
      height: 30px;
      cursor: pointer;
      background: $white;
    }
    .title {
      position: relative;
      margin: 0;
      padding: .85rem 0;
    }
    .content {
      padding: 5px 0;
    }
  }
}
</style>