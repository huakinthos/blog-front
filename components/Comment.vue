<template>
  <div class="comment-box" id="comment-box">
    <div class="comment-total">
      <strong class="count"></strong>
      <span>{{ total }} 条评论</span>
    </div>

    <form class="comment-form" id="comment-form">
      <!-- 编辑评论区域 -->
      <div class="form-box">
        <div class="user-info">
          <div class="avatar">
            <img :src="user.avatar || ''" :alt="user.name || '匿名用户'" />
          </div>
        </div>
        <div class="input-box">
          <transition-group name="list" tag="div">
            <div class="reply-btn" v-if="pid" key="1">
              <span @click="toReplyContentById(`item-${replyCommentName.id}`)" class="btn-name">
                <strong>@ {{replyCommentName.author.name}}</strong>
              </span>
              <span class="cancel" @click="cancelReply">
                <i class="iconfont icon-guanbi"></i>
              </span>
              <p class="thumb-content">
                {{ replyCommentName.content}}
              </p>
            </div>
            <div class="markdown" key="2">
              <div
                class="markdown-editor"
                ref="markdown"
                contenteditable="true"
                placeholder="写下评论吧..."
                @keyup="commentContentChange($event)"
              ></div>
            </div>
            <div class="tools" key="3">
              <a href class="emoji" title="emoji" @click.stop.prevent>
                <i class="iconfont icon-emoji"></i>
                <transition name="fade">
                  <div class="emoji-box">
                    <ul class="emoji-list">
                      <li class="emoji-item" @click="insertEmoji('CN')">CN</li>
                      <li class="emoji-item" @click="insertEmoji('US')">US</li>
                    </ul>
                  </div>
                </transition>
              </a>
              <a href class="image" title="image" @click.stop="insertContent('image')">
                <i class="iconfont icon-image"></i>
              </a>
              <a href class="code" title="code" @click.stop="insertContent('code')">
                <i class="iconfont icon-code"></i>
              </a>
              <button type="submit" class="submit" @click="submitComment($event)">
                <i class="iconfont icon-submit"></i>
                <span>{{ comment.posting ? '正在提交...' : '发布留言' }}</span>
              </button>
            </div>
          </transition-group>
        </div>
      </div>
      <!-- 用户信息区域 -->
      <transition name="module" mode="out-in">
        <div class="user-box" v-if="!userCache">
          <div class="name">
            <input
              type="text"
              v-model="user.name"
              required
              name="name"
              placeholder="称呼(必填)"
              maxlength="10"
            />
          </div>
          <div class="email">
            <input
              type="text"
              v-model="user.email"
              required
              name="email"
              placeholder="邮箱(必填)"
              maxlength="40"
            />
          </div>
          <div class="site">
            <input type="url" v-model="user.url" name="site" placeholder="网站(非必填)" maxlength="40" />
          </div>
        </div>

        <div class="user-box" v-else>
          <div class="modify-user">
            <span class="name">{{user.name}}</span>
            <span class="logout" @click="clearLocalUser">
              <i class="iconfont icon-logout"></i>
              登出
            </span>
          </div>
        </div>
      </transition>
    </form>
    <!-- 评论列表区域 -->
    <div class="comment-list" v-if="comment.data.list && comment.data.list.length !== 0" key="1">
      <transition-group name="list" tag="ul" class="list">
        <li
          v-for="comment in comment.data.list"
          :key="comment.id"
          :item="`item-${comment.id}`"
          class="item"
          :class="{'active': `item-${comment.id}` === activeComment}"
          :id="`item-${comment.id}`"
        >
          <div class="user-avatar">
            <a :href="comment.author.url" @click="clickUser($event, comment.author)">
              <img :alt="comment.author.name || '匿名用户'" />
            </a>
          </div>
          <div class="user-content">
            <div class="header">
              <a
                class="user-name"
                :href="comment.author.url"
                target="_blank"
                @click.stop="clickUser($event, comment.author)"
              >{{comment.author.name}}</a>
              <span class="time">{{comment.author.create_time}}</span>
            </div>
            <div class="body">
              <div class="reply-box" v-if="comment.pid">
                <div class="reply-name">
                  <a @click.stop="toReplyContentById(`item-${comment.pid}`)">
                    <strong v-if="fondReplyParentName(comment.pid)">@ {{ fondReplyParentName(comment.pid) }}</strong>
                  </a>
                </div>
                <div
                  class="reply-content"
                  v-html="fondReplyParentContent(comment.pid).length > 50
                  ? fondReplyParentContent(comment.pid).slice(0, 50) + '...'
                  : fondReplyParentContent(comment.pid) ">
                </div>
              </div>
              <div v-html="markdown(comment.content)"></div>
            </div>
            <div class="footer">
              <span
                class="like"
                :class="{'liked': commentLiked(comment._id), 'actived': comment.likes}"
                @click="likeComment(comment)"
              >
                <i class="iconfont icon-dianzan"></i>
                <span>赞 ({{comment.likes}})</span>
              </span>
              <span class="reply" @click="replyComment(comment.id)">
                <i class="iconfont icon-reply"></i>
                <span>回复</span>
              </span>
            </div>
          </div>
        </li>
      </transition-group>
    </div>

  </div>
</template>

<script>
import marked from '../plugins/marked'
import { scrollTo } from '../utils/scroll'
import _ from '../utils/underscore'
import loadingVue from './Loading'
export default {
  name: 'comment',
  props: {
    referId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      // 父级评论
      pid: 0,
      // 评论
      sort: 1,
      activeComment: 0,
      // 本地用户
      user: {
        name: '',
        email: '',
        url: '',
        avatar: null
      },
      userCache: false,
      likeComments: [],
      form_rules: {
        email: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
        url: /^((https|http):\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/
      },
      // 编辑器
      comemntContentHtml: '',
      comemntContentText: '',
    }
  },
  computed: {
    comment() {
      return this.$store.state.comment
    },
    // 当前用户想要直接回复时找到对应的item
    replyCommentName() {
      return this.comment.data.list.find(item => item.id === this.pid)
    },
    haveMore() {
      return this.$store.state.comment.data.pagination.current_page !== this.$store.state.comment.data.pagination.total_page
    },
    total() {
      return this.comment.data.pagination.total
    }
  },
  mounted() {
    this.initLocalUser()
    // 距离页面最低小于200px 加载评论
    window.onscroll = _.throttle(() => {
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      let windowHeight = window.innerHeight
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      if (scrollHeight - windowHeight - scrollTop <= 200) {
        if (!this.comment.data.pagination.total_page && !this.comment.fetching) {
          this.getCommentList()
        } else if (this.haveMore && !this.comment.fetching) {
          this.getCommentList({ current_page: this.comment.data.pagination.current_page + 1 })
        }
      }
    })
  },
  methods: {
    // 解析markdown
    markdown(content) {
      return marked(content, null, false).html
    },
    // markdown编辑器 内容
    commentContentChange() {
      const html = this.$refs.markdown.innerHTML
      const text = this.$refs.markdown.innerText
      if (!Object.is(html, this.comemntContentHtml)) this.comemntContentHtml = html
      if (!Object.is(text, this.comemntContentText)) this.comemntContentText = text
    },
    updateCommnetContent({ start = '', end = '' }) {
      if (!start || !end) return false
      let selectedText = (document.getSelection || window.getSelection)().toString()
      let currentText = this.$refs.markdown.innerText
      if (selectedText) {
        let newText = currentText.replace(selectedText, start + selectedText + end)
        this.$refs.markdown.innerText = newText
      } else {
        this.$refs.markdown.innerText = this.$refs.markdown.innerText += (start + end)
        this.$refs.markdown.scrollTop = this.$refs.markdown.scrollHeight
      }
      this.commentContentChange()
    },
    clearCommentContent() {
      this.comemntContentHtml = ''
      this.$refs.markdown.innerHTML = ''
      this.commentContentChange()
    },
    insertContent(type) {
      const contents = {
        image: {
          start: '![',
          end: ']()'
        },
        link: {
          start: '[',
          end: ']()'
        },
        code: {
          start: '\n```javascript\n',
          end: '\n```'
        }
      }
      this.updateCommnetContent(contents[type])
    },
    insertEmoji(emoji) {
      this.insertContent({ end: emoji })
    },
    // 初始化本地用户
    initLocalUser() {
      let user = localStorage.getItem('local_user')
      let likeComments = localStorage.getItem('like_comments')
      if (likeComments) this.likeComments = JSON.parse(likeComments)
      if (user) {
        this.user = JSON.parse(user)
        this.userCache = true
      }
    },
    // 更新用户数据
    updateLocalUser() {
      if (!this.user.name) return alert('请输入昵称！')
      if (!this.user.email) return alert('请输入邮箱!')
      if (!this.form_rules.email.test(this.user.email)) return alert('邮箱不合法')
      if (this.user.url && !this.form_rules.url.test(this.user.url)) return alert('网站格式不正确')
      localStorage.setItem('local_user', JSON.stringify(this.user))
    },
    // 清除本地用户数据
    clearLocalUser() {
      localStorage.removeItem('local_user')
      Object.keys(this.user).forEach(key => {
        this.user[key] = ''
      })
      this.userCache = false
    },
    // 点击用户头像或昵称跳转
    clickUser(e, user) {
      if (!user.url) e.preventDefault()
    },
    // 评论排序
    async sortComment(sort) {
      if (!Object.is(this.sort, sort)) {
        this.sort = sort
        await this.getCommentList()
        setTimeout(() => {
          this.toReplyContentById('comment-box')
        }, 300);
      }
    },
    // 获取评论
    async getCommentList(parmas = {}) {
      parmas.sort = -1
      await this.$store.dispatch('comment/getCommentList', {
        ...parmas,
        refer_id: this.referId
      })
    },
    // 提交评论
    async submitComment(event) {
      event.preventDefault()
      this.updateLocalUser()
      if (!this.comemntContentText || !this.comemntContentText.replace(/\s/g, '')) return alert('不要提交空白哦!')
      let maxLine = this.comemntContentText.split('\n').length > 30
      let maxlength = this.comemntContentText.length > 500
      if (maxLine || maxlength) return alert('字数限制500以内, 总行数限制30以内')
      if (!this.user.url) delete this.user.url
      let res = await this.$store.dispatch('comment/postComment', {
        pid: this.pid,
        refer_id: this.referId,
        content: this.comemntContentText,
        author: JSON.stringify(this.user)
      })
      if (res.code === 200) {
        alert(res.message)
        this.userCache = true
        this.clearCommentContent()
      } else alert(res.message)
    },
    // 回复评论
    replyComment(pid) {
      this.pid = pid
      this.toReplyContentById('comment-form')
    },
    cancelReply() {
      this.pid = 0
    },
    // 通过父级评论pid 前往某条回复 或 前往post-box
    toReplyContentById(id) {
      const targetEl = document.getElementById(id)
      let toCommentForm = Object.is(targetEl, 'comment-form') // 编辑区域
      let toCommentBox = Object.is(targetEl, 'comment-box') // 评论顶部
      let boxOffset = toCommentBox ? -70 : -300
      scrollTo(targetEl, 500, { offset: toCommentForm ? -110 :  boxOffset })
      // 前往编辑评论区域，激活编辑区域的光标
      if (toCommentForm) {
        let markdown = this.$refs.markdown
        let selection = window.getSelection()
        let range = document.createRange()
        range.setStart(markdown, markdown.childElementCount)
        range.setEnd(markdown, markdown.childElementCount)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        this.activeComment = id
      }
    },
    // 非当前用户想要回复的item
    // 回复的来源 姓名
    fondReplyParentName(pid) {
      const parent = this.$store.state.comment.data.list.find(item => item.id === pid)
      return parent ? parent.author.name : null
    },
    // 回复的来源 内容
    fondReplyParentContent(pid) {
      const parent = this.$store.state.comment.data.list.find(item => item.id === pid)
      const content = parent ? parent.content : ''
      return this.markdown(content)
    },
    // 点赞评论
    likeComment(comment) {
      if (this.commentLiked(comment._id)) return
      let res = this.$store.dispatch('comment/likeComment', { _id: comment._id })
      if (res) {
        this.likeComments.push(comment._id)
        localStorage.setItem('like_comments', JSON.stringify(this.likeComments))
      } else {
        console.warn('点赞失败')
      }
    },
    // 用户点赞的评论
    commentLiked(_id) {
      return this.likeComments.includes(_id)
    }
  },
  components: {
    'my-loading': loadingVue
  }
}
</script>

<style lang="scss" scoped>
.comment-box {
  position: relative;
  padding: 1rem 0;
  margin-top: 1rem;
  .comment-total {
    position: relative;
    display: flex;
    padding: 1rem 0;
    align-items: center;
    justify-content: center;
  }

  .comment-form {
    margin-top: 1rem;
    .form-box {
      width: 100%;
      display: flex;
      .user-info {
        margin-right: 1rem;
        .avatar {
          display: block;
          margin-bottom: 0.5rem;
          width: 36px;
          height: 36px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .input-box {
        position: relative;
        flex-grow: 1;
        max-width: calc(100% - 56px);
        .reply-btn {
          position: absolute;
          left: 0.5rem;
          top: -2rem;
          display: flex;
          padding: .3rem .5rem;
          align-items: center;
          justify-content: space-between;
          .btn-name {
            color: $secondary;
            font-weight: bold;
            font-size: $font-size-small;
            margin-right: 10;
            &:hover {
              color: $black;
            }
          }
          .cancel {
            margin-left: .7rem;
            cursor: pointer;
          }
          .thumb-content {
            word-wrap: break-word;
            font-size: .8rem;
            border-radius: 4px;
            border: #ccc;
            margin-left: .85rem;
          }
        }
        .markdown {
          position: relative;
          overflow: hidden;
          .markdown-editor {
            min-height: 6em;
            max-height: 30em;
            overflow: auto;
            outline: none;
            padding: 0.5em;
            cursor: auto;
            font-size: 0.95em;
            line-height: 1.8em;
            border: 1px solid $border-color;
            border-radius: 4px;
            &:hover {
              border-color: $form-hover;
            }
            &:focus {
              border-color: $black;
            }
            &:empty:before {
              content: attr(placeholder);
              color: $disabled;
            }
            &:focus {
              content: none;
            }
          }
        }
        .tools {
          height: 2rem;
          line-height: 2rem;
          margin-top: 0.4rem;
          .emoji,
          .image,
          .link,
          .code {
            width: 2rem;
            height: 2rem;
            text-align: center;
            display: inline-block;
            &:hover {
              background: rgba(0, 0, 0, 0.12);
            }
          }
          .emoji {
            &:hover {
              .emoji-box {
                display: block;
              }
            }
          }
          .emoji-box {
            display: none;
            position: absolute;
            bottom: -0.5rem;
            left: 0;
            width: 250px;
            padding: 0.5rem;
            background: $white;
            z-index: 999;
            .emoji-list {
              list-style: none;
              padding: 0;
              margin: 0;
              display: flex;
              flex-wrap: wrap;
              .emoji-item {
                padding: 0 0.4rem;
                cursor: pointer;
                &:hover {
                  background: rgba(0, 0, 0, 0.12);
                }
              }
            }
          }
          .submit {
            float: right;
            border: 0;
            padding: 0 0.5rem;
            span {
              margin-right: 0.5rem;
            }
            &:hover {
              background: rgba(0, 0, 0, 0.12);
            }
          }
        }
      }
    }

    .user-box {
      display: flex;
      width: 100%;
      height: 2rem;
      line-height: 2rem;
      margin-top: 0.3rem;
      .name,
      .email,
      .site {
        flex-grow: 1;
        input {
          width: 100%;
          height: 2em;
          padding: 0.5rem;
          background: transparent;
          border: 1px solid $border-color;
          border-radius: 4px;
          &:hover {
            border-color: $form-hover;
          }
          &:focus {
            border-color: $black;
          }
        }
      }
      .email,
      .name {
        margin-right: 1em;
      }
    }
  }

  .comment-list {
    margin-top: 1rem;
    .list {
      padding: 0;
      margin: 0;
      list-style: none;
      .item {
        position: relative;
        padding: 0.6em 0 0.6em 4.4em;
        &.active {
          border: 1px dashed $red;
        }
        .user-avatar {
          display: block;
          position: absolute;
          left: 0.8rem;
          top: 1.2rem;
          a {
            display: block;
            width: 36px;
            height: 36px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .user-content {
          display: block;
          width: 100%;
          height: 100%;
          padding: 0.5rem;
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .user-name {
              font-weight: bold;
              &:hover {
                text-decoration: underline;
              }
            }
            .time {
              color: $disabled;
              font-size: $font-size-small;
            }
          }
          .body {
            color: $black;
            .reply-box {
              border: 1px solid $border-color;
              padding: .5rem .8rem;
              display: flex;
              margin: .7rem 0;
              .replay-name {
                color: $secondary;
                font-weight: bold;
                font-size: $font-size-small;
                margin-right: 1rem;
                a {
                  text-decoration: none;
                  &:hover {
                    text-decoration: underline;
                  }
                }
              }
              .replay-content {
                flex: 1;
              }
            }
          }
          .footer {
            margin-top: .5rem;
            display: flex;
            align-items: center;
            .like,
            .reply {
              font-size: 0.8rem;
              margin-right: 1rem;
              &:hover {
                color: $red;
              }
              &.liked {
                font-weight: bold;
              }
            }
            .replay {
              display: none;
            }
            &:hover {
              .replay {
                display: block;
              }
            }
          }
        }
      }
    }
  }
}
</style>