<template>
  <div class="article-list">
    <div class="article-type">
      <div class="type-item">代码</div>
      <div class="type-item">生活</div>
    </div>

    <div class="article-list">
      <li class="article-item" v-for="item in articleList" :key="item._id">
        <nuxt-link :to="`/article/${item._id}`" class="item-wrapper">
          <h2 class="title">{{item.title}}</h2>
          <div class="content">
            <div class="thumb">{{item.thumb}}</div>
            <div class="descript">{{item.descript}}</div>
          </div>
          <div class="state">
            <div class="meta">
              <div class="views"><i class="iconfont com"></i>{{item.meta.views}}</div>
              <div class="likes"><i class="iconfont com"></i>{{item.meta.likes}}</div>
              <div class="comments"><i class="iconfont com">{{item.meta.comments}}</i></div>
              <div class="type"><i class="iconfont com"></i>{{item.type === 1 ? '代码' : '生活'}}</div>
            </div>
            <div class="time"><i class="iconfont com"></i>{{item.create_time}}</div>
          </div>
        </nuxt-link>
      </li>
    </div>

    <my-switch :visible.sync="showSwitch">
      <span class="tag" v-for="tag in tags" :key="tag">{{tag}}</span>
    </my-switch>
  </div>
</template>

<script>
import SwitchVue from '../components/Switch.vue'
export default {
  name: 'article-list',
  fetch({ store }) {
    return store.dispatch('article/getArticleList')
  },
  data() {
    return {
      showSwitch: false
    }
  },
  computed: {
    articleList() {
      return this.$store.state.article.data.list
    },
    type() {
      return ['code', 'live']
    },
    tags() {
      this.$store.state.tag.data.list
    }
  },
  components: {
    'my-switch': SwitchVue
  }
}
</script>

<style lang="scss" scoped>
.article-list {
  width: $container-min-width;
  margin: 0 auto;
  .article-type {
    padding: 20px 0 40px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin: 0 -8px 15px;
    .type-item {
      position: relative;
      flex: 1 0;
      max-height: 100px;
      margin: 0 8px;
      text-align: center;
      overflow: hidden;
      border-radius: 4px;
      background: $code-bg;
      transition: all .3s;
      &:hover {
        box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, .2);
        transform: translate(-4px, -4px);
      }
    }
  }

  .article-list {
    padding: 20px 0 40px;
    box-sizing: border-box;
    .article-item {
      display: block;
      padding: 0 20px;
      list-style: none;
      border-bottom: 1px solid $black;
      .item-wrapper {
        text-decoration: none;
        cursor: pointer;
        padding: 15px 0;
        display: block;
        border-bottom: 1px solid $border-color;
        &:hover {
          .title {
            transform: translateX(20px)
          }
        }
        .title {
          color: $black;
          font-weight: 400;
          margin-bottom: 10px;
          padding: 5px 0;
          transition: all .3s;
        }
        .content {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          margin-bottom: 16px;
          .thumb {
            flex: 0 0 150px;
            width: 150px;
            max-height: 90px;
            margin-right: 16px;
            overflow: hidden;
            border: 4px solid $black;
            img {
              width: 100%;
              height: auto;
              object-fit: cover;
              transition: all .3s cubic-bezier(.215,.61,.355,1);
            }
          }
          .descript {
            flex: 1 0;
            color: $border-color;
          }
        }
        .state {
          color: $black;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: $font-size-small;
          .meta {
            flex: 1 0 ;
            display: flex;
            align-items: center;
            flex-direction: row;
            justify-content: flex-start;
            > div {
              margin-right: 12px;
            }
          }
        }
      }
    }
  }
  .switch {
    .tag {
      display: inline-block;
      font-size: .8rem;
      padding: 2px 10px;
      border-radius: 1rem;
      border: 1px solid $disabled;
      margin: 0 0 .6rem 1rem;
      cursor: pointer;
      transition: all .3s;
      &:hover {
        border-color: $text;
      }
    }
  }
}
</style>