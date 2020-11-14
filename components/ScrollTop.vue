<template>
  <transition-group tag="div" name="fade" class="scroll-top">
    <a href="javascript:;" @click="toggleTheme" class="scroll-btn theme" key="2">
      <i class="iconfont" :class="{'dark': theme === 'icon-dark', 'light': theme === 'icon-light'}"></i>
    </a>
    <a href="javascript:;" @click="scrollTop" v-show="showScroll" class="scroll-btn" key="1">
      <i class="iconfont icon-up"></i>
    </a>
  </transition-group>
</template>

<script>
export default {
  name: 'scroll-top',
  data() {
    return {
      theme: '',
      showScroll: false
    }
  },
  methods: {
    toggleTheme() {
      const isLight = document.body.id === 'light'
      this.theme = isLight ? 'dark' : 'light'
      document.body.id = this.theme
      window.localStorage.setItem('theme', this.theme)
    },
    scrollTop() {
      let timer = null
      cancelAnimationFrame(timer)
      timer = requestAnimationFrame(function cb() {
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
        if (scrollTop > 0) {
          document.body.scrollTop = document.documentElement.scrollTop = scrollTop - 150
          timer = requestAnimationFrame(cb)
        } else {
          cancelAnimationFrame(timer)
        }
      })
    }
  },
  mounted() {
    function getScrollTop() {
      let scrollTop = 0
      let bodyScrollTop = 0
      let documentScrollTop = 0
      if (document.body) {
        bodyScrollTop = document.body.scrollTop
      }
      if (document.documentElement) {
        documentScrollTop = document.documentElement.scrollTop
      }
      scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop
      return scrollTop
    }
    function getWindowHeight() {
      let windowHeight = window.innerHeight
      return windowHeight
    }
    window.addEventListener('scroll', () => {
      if (getScrollTop() * 2 > getWindowHeight()) {
        this.showScroll = true
      } else {
        this.showScroll = false
      }
    })

    this.theme = localStorage.getItem('theme') || 'light'
  }

}
</script>

<style lang="scss" scoped>
.scroll-top {
  position: fixed;
  right: 0;
  bottom: 8rem;
  .scroll-btn {
    display: block;
    width: 3rem;
    height: 3rem;
    margin-bottom: .5rem;
    text-align: center;
    line-height: 3rem;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.14);
    cursor: pointer;
    &.theme {
      background: #000;
    }
  }

}
</style>