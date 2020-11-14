<template>
  <div class="article">
    <div class="article-content">
      <h3 class="title">{{article.title}}</h3>
      <div class="meta">
        <span class="time">{{article.create_time}}</span>
        <span class="num">字数: {{article.content.length}}</span>
        <span class="like">喜欢: {{article.meta.likes}}</span>
        <span class="comment">评论: {{article.meta.comments}}</span>
      </div>
      <div class="content" v-html="articleContent"></div>
    </div>

    <div class="tools">
      <div class="tools-like" @click="like">
        <span class="likeing">
          <i :class="{'is-liked': isLiked}" class="iconfont icon-like"></i>
          <span>{{ article.meta.likes || 0 }}</span>
        </span>
      </div>
      <div class="tools-comment" @click="scrollToComment">
        <span class="comment">
          <i class="iconfont icon-comment"></i>
          <span>{{ article.meta.comments || 0}}</span>
        </span>
      </div>
      <div class="tools-share"></div>
    </div>

    <my-comment :referId="article.id" v-if="article.title"></my-comment>

    <img-dialog :visible.sync="showDialog" :img="img" :loading="loadingImg"></img-dialog>
  </div>
</template>

<script>

import marked from '../../plugins/marked'
import { scrollTo } from '../../utils/scroll'
import DialogVue from '../../components/Dialog.vue'
import CommentVue from '../../components/Comment.vue'
export default {
  name: 'article',
  transition: 'fade',
  fetch({ store, params }) {
    return store.dispatch('article/getArticle', params)
  },
  head() {
    return { title: `${this.$store.state.article.article.title}` }
  },
  data() {
    return {
      likeArticles: [],
      img: '',
      scroll: '',
      loadingImg: false,
      showDialog: false
    }
  },
  mounted() {
    this.init()
    this.initEvent()
  },
  computed: {
    article() {
      return this.$store.state.article.article
    },
    articleContent() {
      return marked(this.article.content, false, true).html
    },
    isLiked() {
      return this.likeArticles.includes(this.article._id)
    },
    tag() {
      return this.$store.tag.data.list
    }
  },
  methods: {
    init() {
      this.likeArticles = JSON.parse(localStorage.getItem('LIKE_ARTICLES') || '[]')
    },
    async like() {
      if (this.isLiked) return false
      let res = await this.$store.dispatch('article/likeArt', { _id: this.article._id })
      if (res.code === 200) {
        this.article.meta.likes += 1
        this.likeArticles.push(this.article._id)
        localStorage.setItem('LIKE_ARTICLES', JSON.stringify(this.likeArticles))
      } else {
        alert('喜欢文章失败:' + res.message)
      }
    },
    scrollToComment() {
      scrollTo(document.querySelector('#commnet-box'), 500, { offset: 0 })
    },
    initEvent() {
      import('../../utils/lazyLoad').then(res => {
        res.default('.image-large')
      })
      // 点击图片查看大图
      const content = document.querySelectorAll('.content')[0]
      content.addEventListener('click', e => {
        const target = event.target
        if (target.nodeName.toLocaleLowerCase() === 'img' && target.classList.contains('img-large')) {
          e.stopPropagation()
          this.loadingImg = true
          const origin = target.nextElementSibling
          const src = origin.getAttribute('data-original')
          origin.onload = () => {
            this.loadingImg = false
          }
          origin.onerror = () => {
            this.loadingImg = false
            this.img = target.getAttribute('src')
          }

          origin.src = src
          this.showDialog = true
          this.img = src
        }
      })
    }
  },
  components: {
    'img-dialog': DialogVue,
    'my-comment': CommentVue
  }
}
</script>

<style lang="scss" scoped>
.article {
  width: $container-min-width;
  margin: 0 auto;
  .article-content {
    .title {
      font-size: $font-size-title;
    }
    .meta {
      margin-top: .3rem;
      font-size: .8rem;
      color: $descript;
      span {
        margin-right: .5rem;
      }
    }
    .content {
      margin: $lg-pad 0;
      color: $black;
      word-wrap: break-word;

      .demo {
        border: 1px solid $border-color;
        border-radius: 2px;
        padding: 25px 35px;
        margin-top: 1em;
        margin-bottom: 40px;
        font-size: 1.2em;
        line-height: 1.5em;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        overflow-x: auto;
      }

      a {
        margin: 0 .1rem;

        &.c-link {
          color: $blue;
        }

        &.image-link {
          margin: 0;
        }

        &:hover {
          text-decoration: underline;
        }
      }

      .image-package {
        text-align: center;
        width: 92%;
        margin: 0 auto 1rem auto;

        .img-caption {
          min-width: 10%;
          max-width: 80%;
          min-height: 22px;
          display: inline-block;
          padding: 6px;
          margin: 10px auto;
          border-bottom: 1px solid $border-color;
          font-size: 14px;
          color: $disabled;
          line-height: 1.2;

          &:empty {
            display: none;
          }
        }
      }

      img {
        max-width: 100%;
        display: block;
        text-align: center;
        border-radius: $radius;
        transition: all .25s;

        &.img-pop {
          cursor: zoom-in;
        }
      }

      p {
        line-height: 1.8rem;
        margin: 1.5rem 0;

        &.text-center {
          text-align: center;
        }

        &.text-right {
          text-align: right;
        }
      }

      iframe {
        margin: 1.5rem 0;
        background: $black;

        &.music {
          background: transparent;
          width: 100%;
        }
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        margin: 1.5rem 0;
        padding-left: 0;
        line-height: 1.8rem;
        font-weight: 700;
        text-indent: 0;

        &:target{
          padding-top: 4.5rem;
        }
      }

      hr {
        height: 0.1rem;
        background: $text;
        border: 0;
      }

      blockquote {

        padding: 0 1rem;
        margin: 1.5rem 0;
        color: #6a737d;
        border-left: 0.25rem solid #dfe2e5;

        p {
          text-indent: 0rem;

          &:first-child {
            margin-top: 0;
          }
          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      ul {
        list-style-type: square;
      }

      ul,
      ol {
        padding-left: 2rem;
        margin: 1.5rem 0;

        >li {
          line-height: 1.5rem;
          padding: .5rem;
          list-style-type: disc;


          >p {
            text-indent: 0;
            margin: 0;
          }

          >ul {

            li {
              list-style-type: circle;
            }

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }

      ul {
        list-style: disc;
      }

      table {
        font-size: .8rem;
        max-width: 100%;
        overflow: auto;
        border: 1px solid $border-color;
        border-collapse: collapse;
        border-spacing: 0;

        thead {
          background: $module-bg;
          text-align: left;
        }

        th, td {
          padding: .8rem .5rem;
          line-height: 1.5rem;
        }

        tr:nth-child(2n) {
          background: $module-bg;
        }

        td {
          min-width: 7.5rem;
        }
      }

      code {
        padding: .2rem .4rem;
        margin: 0;
        border-radius: $radius;
        background-color: $module-hover-bg;
        color: $red-light-1;
      }

      pre {
        margin: 1.5rem 0;
        overflow: auto;
        font-size: 85%;
        line-height: 1.45;
        background-color: $code-bg;
        border-radius: 3px;
        word-wrap: normal;

        >code {
          margin: 0;
          padding: 1rem;
          float: left;
          width: 100%;
          height: 100%;
          display: block;
          line-height: 1.6rem;
          background-color: transparent;
          color: $text;
        }
      }
    }
  }

  .tools {
    position: fixed;
    left: 1rem;
    top: 6rem;
    > div {
      position: relative;
      width: 3rem;
      height: 3rem;
      text-align: center;
      line-height: 3rem;
      border: 1px solid $border-color;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .15);
      &.tools-like:hover {
        color: $red;
        border-color: $red;
      }
      &.tools-comment:hover {
        color: $green;
        border-color: $green;
      }
      &.is-liked {
        color: $red;
      }

      > span {
        position: absolute;
        position: absolute;
        left: -0.8rem;
        top: -10px;
        line-height: 1;
        color: $black;
        font-size: 1rem;
        padding: $xs-pad $sm-pad;
        background: $border-color;
        border-radius: .7rem;
      }
    }
  }

  .dialog {
    .dialog-box {
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100%;
      background: transparent;
      .content {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        img {
          display: block;
          margin: 0 auto;
          max-width: 90%;
          max-width: 90%;
          cursor: zoom-out;
        }
      }
    }
  }
}
</style>