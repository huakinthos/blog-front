<template>
  <header v-flex class="shadow">
    <div class="header">
      <div class="header-logo">
        <nuxt-link to="/">去首页</nuxt-link>
      </div>
      <div class="header-tools">
        <div class="navs" v-if="show_music_nav">
          <div class="nav-item" @click="toggleNav(false)">
            <nuxt-link to="/">回首页</nuxt-link>
          </div>
          <div class="nav-item">
            <nuxt-link to="/music/search">搜索</nuxt-link>
          </div>
          <div class="nav-item">
            <nuxt-link to="/music/albumSheet">歌单</nuxt-link>
          </div>
          <div class="nav-item">
            <nuxt-link to="/music/rank">排行</nuxt-link>
          </div>
          <div class="nav-item">
            <nuxt-link to="/music/setting">设置</nuxt-link>
          </div>
        </div>
        <div class="navs" v-else>
          <div class="nav-item">
            <nuxt-link to="/articleList">文章</nuxt-link>
          </div>
          <div class="nav-item">
            <nuxt-link to="/about">关于我</nuxt-link>
          </div>
          <div class="nav-item" @click="toggleNav(true)">
            <nuxt-link to="/music/search">歌曲</nuxt-link>
          </div>
          <div class="nav-item">
            <nuxt-link to="/wall">留言墙</nuxt-link>
          </div>
        </div>
        <!-- <div class="search-box" @click="search_open === true">
          <div class="search" :class="{'open': search_open}">
            <input type="text" v-model="search_keyword" placeholder="search..." @keyup.enter="search" ref="search">
            <div class="ok-icon" @click.stop="search"></div>
          </div>
        </div> -->
      </div>
    </div>
  </header>
</template>

<script>
import _ from '~/utils/underscore'
export default {
  name: 'my-header',
  data() {
    return {
      search_keyword: '',
      search_open: false,
      show_music_nav: false,
      nav: [
        { path: '/articleList', name: '文章', children: [{ path: '/code', name: '代码' }, { path: '/live', name: '生活' }]},
        { path: '/about', name: '关于我' },
        { path: '/music', name: '歌曲', children: [{ path: '/search', name: '搜索' }, { path: '/local', name: '本地' }]},
        { path: '/wall', name: '留言墙' }
      ]
    }
  },
  watch: {
    search_open(val) {
      if (val) {
        this.$refs.search.focus()
      }
    }
  },
  methods: {
    toggleNav(flag) {
      this.show_music_nav = flag
      this.$store.commit('options/SET_MUSIC_LAYOUT', flag)
    },
    search_hide() {
      this.search_open = false
    },
    search() {
      this.search_open = false
      this.search_keyword = ''
    }
  },
  directives: {
    flex: {
      inserted(el) {
        let beforeScrollTop = document.documentElement.scrollTop || window.pageYOffset || window.screenY || document.body.scrollTop
        window.addEventListener('scroll', _.throttle(() => {
          let afterScrollTop = document.documentElement.scrollTop || window.pageYOffset || window.screenY || document.body.scrollTop
          let gap = afterScrollTop - beforeScrollTop
          if (gap === 0) return
          gap > 0 ? el.classList.add('fixed') : el.classList.remove('fixed')
          setTimeout(() => {
            beforeScrollTop = afterScrollTop
          }, 0);
        }, 200))
      },
      unbind() {
        window.onscroll = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  position: fixed;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 60px;
  background: $white;
  transform: translateY(0%);
  transition: all .3s;
  &.fixed {
    transform: translateY(-100%)
  }
  &.shadow {
    box-shadow: 0, 1px, 2px, rgba(0,0,0,.05);
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: $header-height;
    min-width: $container-min-width;
    line-height: $header-height;
    .header-logo {
      display: flex;
    }
    .header-tools {
      display: flex;
    }
  }

  .navs {
    flex: 1;
    display: flex;
    .nav-item {
      position: relative;
      padding: 0 1.5rem;
      color: $disabled;
      a:hover {
        color: $black;
      }
      &:hover {
        .sub-nav {
          display: block;
        }
      }
    }

    .sub-nav {
      display: none;
      position: absolute;
      top: $header-height;
      width: 100%;
      cursor: pointer;
      .sub-nav-item {
        padding-left: .8rem;
        background: $code-bg;
        &:hover {
          background: $module-hover-bg-light-3;
        }
      }
    }

    a.nuxt-link-exact-active {
      color: $module-hover-bg-light-3;
    }
  }

  .search-box {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: .5rem;
    width: 100%;
    height: 40px;
    cursor: pointer;
    transform: translate3d(0, 0, 0);

    .search {
      position: relative;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      border: 2px solid #000;
      transition: all .3s ease .15s;
      &::after {
        content: '';
        width: 5px;
        height: 2px;
        bottom: 10%;
        right: 0%;
        background-color: #000;
        transform: rotate(45deg);
        transform-origin: top left;
        transition: width .15s ease .45s;
      }

      > input {
        position: absolute;
        width: 100%;
        height: 100%;
        background: transparent;
        font-size: 14px;
        line-height: 30px;
        opacity: 0;
        color: #ccc;
        transition: all .15s ease;
      }

      > .ok-icon {
        position: absolute;
        width: 16px;
        height: 18px;
        top: 50%;
        right: 2px;
        z-index: 20;
        cursor: pointer;
        transform: translateY(-50%);
        &::after, &::before {
          content: '';
          width: 0px;
          height: 2px;
          right: 1px;
          border-radius: 1px;
          background: #000;
          transition: all .25s ease;
        }
        &::before {
          top: 0;
          transform: rotate(45px);
          transform-origin: top right;
          transition-delay: 1s;
        }
        &:after {
          bottom: 0;
          transform: rotate(-45px);
          transform-origin: bottom right;
          transition-delay: 0s;
        }
      }
    }
    .search.open {
      width: 100%;
      border: none;
      transition-delay: .1s;
      &::after {
        width: 0;
      }
      > input {
        position: absolute;
        opacity: 1;
        padding: .5rem 2.5rem .5rem .5rem;
        transition-delay: .05s;
      }
      > .ok-icon {
        right: 10px;
        &:before, &:after {
          width: 15px;
        }

        &:before {
          top: 2px;
          right: 0;
          transition-delay: .25s;
        }

        &:after {
          right: 10px;
          bottom: 2px;
          width: 8px;
          transition-delay: .3s;
        }
      }
    }
  }
}
</style>