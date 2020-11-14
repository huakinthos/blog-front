<template>
  <transition name="fade">
    <div class="dialog" v-show="dialogVisible" v-click-outside="hide">
      <transition name="slide-down">
        <div class="dialog-box" v-show="dialogVisible">
          <div class="head">
            <span @click="hide"><i class="iconfont icon-guanbi"></i></span>
          </div>
          <div class="content">
            <slot></slot>
            <img :src="img" alt="" v-if="img" class="close" v-click-outside="hide" @click="hide" v-show="!loading">
          </div>
          <div class="tool">
            <slot name="tool"></slot>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'dialog',
  props: ['visible', 'img', 'loading'],
  data() {
    return {
      back: {
        height: '',
        overflow: ''
      }
    }
  },
  computed: {
    dialogVisible() {
      if (this.visible) this.lockBody()
      else this.unLockBody()
      return this.visible
    }
  },
  methods: {
    lockBody() {
      this.back.height = document.body.style.height
      this.back.overflow = document.body.style.overflow
      document.body.style.height = '100%'
      document.body.style.overflow = 'hidden'
    },

    unLockBody() {
      if (typeof window === 'undefined') return
      document.body.style.height = this.back.height
      document.body.style.overflow = this.back.overflow
    },

    hide() {
      this.$emit('update:visible', false)
    }
  }

}
</script>

<style lang="scss" scoped>
.dialog {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgb(73, 70, 70);
  z-index: 999;
  .dialog-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30rem;
    padding: 1rem;
    background: $white;
    border-radius: .5rem;
    box-shadow: 0px 8px 46px rgba(0, 0, 0, 0.08), 0px 2px 6px rgba(0, 0, 0, 0.03);
    .head {
      position: relative;
      text-align: right;
      z-index: 2;
    }
  }
}
</style>