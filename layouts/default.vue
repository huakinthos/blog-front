<template>
  <div id="app">
    <div class="app-main">
      <!-- header -->
      <transition name="fade">
        <div class="header-container">
          <my-header />
        </div>
      </transition>
      <!-- body -->
      <transition-group
        name="side-up"
        tag="div"
        class="container clearfix body-container"
        :class="{ 'music': musicLayout }">
        <div class="content" key="1">
          <nuxt />
        </div>
      </transition-group>
      <!-- footer -->
      <transition name="fade">
        <my-footer />
      </transition>
      <!-- aside -->
      <scroll-top />
      <music-player />
    </div>
  </div>
</template>

<script>
import HeaderVue from '../components/Header.vue'
import FooterVue from '../components/Footer.vue'
import ScrollTopVue from '../components/ScrollTop.vue'
import MusicPlayerVue from '../components/Music/MusicPlayer.vue'

export default {
  components: {
    'my-header': HeaderVue,
    'my-footer': FooterVue,
    'scroll-top': ScrollTopVue,
    'music-player': MusicPlayerVue
  },
  computed: {
    musicLayout() {
      return this.$store.state.options.musicLayout
    }
  },
  mounted() {
    const theme = localStorage.getItem('theme') || 'dark'
    document.body.id = theme
  }
}
</script>

<style lang="scss" scoped>
.app {
  .app-main {
    transition: all .3s ease-out;
    .body-container {
      min-height: calc(100vh - 193px);
      margin-top: 20px;
    }
  }
  .app-main.open {
    transform: translateX(60%);
  }
}

.content {
  position: relative;
  width: 100%;
  margin: 0;
  padding: 1rem;
  padding-top: 2.5rem;
  transition: width .3s cubic-bezier(1.0, 0.5, 0.8, 1.0)
}

.music {
  width: 67.5rem;
}

.text-list {
  position: fixed;
  left: 20px;
  bottom: 50px;
}
</style>
