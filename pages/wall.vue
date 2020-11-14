<template>
  <div class="wall">
    <div class="head">
      <div class="publish-box">
        <a href="javascript:;" class="btn" @click.stop="openBox">发表留言</a>
      </div>
    </div>

    <transition-group name="slide-down" tag="div" class="list-box" v-if="!fetch">
      <div class="column" key="1">
        <div class="list" v-for="list in list1" :key="list._id">
          <div class="name">{{list.name}}</div>
          <div class="content" v-html="markdown(list.content)"></div>
          <div class="time">{{list.create_time}}</div>
        </div>
      </div>

      <div class="column" key="2">
        <div class="list" v-for="list in list2" :key="list._id">
          <div class="name">{{list.name}}</div>
          <div class="content" v-html="markdown(list.content)"></div>
          <div class="time">{{list.create_time}}</div>
        </div>
      </div>

      <div class="column" key="3">
        <div class="list" v-for="list in list3" :key="list._id">
          <div class="name">{{list.name}}</div>
          <div class="content" v-html="markdown(list.content)"></div>
          <div class="time">{{list.create_time}}</div>
        </div>
      </div>
    </transition-group>

    <div class="get-more" v-if="!haveMore">
      <div @click="getMore" class="allow">获取更多</div>
      <div class="not-allow">加载中</div>
    </div>

    <my-dialog :visible.sync="show_box">
      <div>
        <div class="dialog-item name">
          <span>称呼: </span>
          <input type="text" placeholder="称呼" v-model="dialog.name" class="input-item">
        </div>
        <div class="dialog-item content">
          <span>内容</span>
          <textarea v-model="dialog.content" maxlength="160" resize="none" rows="4" placeholder="内容" class="input-item" />
        </div>
      </div>
      <div class="tool" slot="tool">
        <button @click="show_box = false">取消</button>
        <button @click="submit">提交</button>
      </div>
    </my-dialog>
  </div>
</template>

<script>
import DialogVue from '../components/Dialog.vue'
import marked from '../plugins/marked'

export default {
  name: 'wall',
  transition: 'fade',
  head: {
    title: 'wall'
  },
  fetch({ store }) {
    return store.dispatch('leave/getLeave')
  },
  data() {
    return {
      show_box: false,
      dialog: {
        name: '',
        content: ''
      }
    }
  },
  computed: {
    fetch() {
      return this.$store.state.leave.fetch
    },
    allList() {
      return this.$store.state.leave.data.list
    },
    list1() {
      return this.allList.filter((item, index) => index % 3 === 0)
    },
    list2() {
      return this.allList.filter((item, index) => index % 3 === 1)
    },
    list3() {
      return this.allList.filter((item, index) => index % 3 === 2)
    },
    haveMore() {
      return this.$store.state.leave.data.pagination.current_page === this.$store.state.leave.data.pagination.total_page
    }
  },
  methods: {
    markdown(content) {
      return marked(content, null, false).html
    },
    openBox() {
      this.form = Object.assign({}, {
        name: '',
        content: ''
      })
      this.show_box = true
    },
    getMore() {
      let next_page = this.$store.state.leave.data.pagination.current_page + 1
      this.$store.dispatch('leave/getLeave', { current_page: next_page })
    },
    async submit() {
      if (this.dialog.name === '' || this.dialog.content === '') return alert('昵称或内容不能为空!')
      const res = await this.$store.dispatch('leave/postLeave', { ...this.dialog })
      if (res.code === 200) {
        this.show_box = false
        this.dialog = Object.assign({}, {
          name: '',
          content: ''
        })
      }
    }
  },
  components: {
    'my-dialog': DialogVue
  }
}
</script>

<style lang="scss" scoped>
.wall {
  .head {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    width: 12rem;
    height: 5rem;
    font-size: 1.4rem;
    color: $black;
    text-align: center;
    border-top: 1px solid $border-color;
    border-bottom: 1px solid $border-color;
    .btn {
      position: relative;
      padding: .5rem .1rem;
      color: $black;
      border-radius: $xs-pad;
      transition: all .5s ease;
      transform: perspective(1px) translateZ(0);
      animation: publishBtn 10s ease infinite alternate;
    }
  }

  .list-box {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .column {
      display: flex;
      flex-direction: column;
      width: calc(100%/3 - 2rem/3);
    }
    .list {
      position: relative;
      left: 0;
      top: 0;
      padding: $normal-pad;
      min-height: 13rem;
      margin-bottom: 1rem;
      color: $black;
      background: $code-bg;
      transition: all .3s;
      &:hover {
        box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, .2);
        transform: translate(-4px, -4px);
      }
      > .name {
        font-size: 1rem;
        word-break: break-all;
      }
      > .content {
        margin: 1rem 0;
        min-height: 6rem;
        max-height: 20rem;
        font-size: .85rem;
        word-break: break-all;
        overflow: hidden;
      }
      > .time {
        height: 1rem;
        font-size: $font-size-small;
        line-height: 1rem;
        text-align: right;
      }
    }
  }

  .get-more {
    margin-top: 1px;
    padding: 1rem;
    background: $white;
    text-align: center;
    color: $black;
    &:hover {
      background: rgba(0, 0, 0, .2);
    }
    > .allow {
      cursor: pointer;
    }
    > .not-allow {
      cursor: not-allowed;
    }
  }

  .dialog {
    .dialog-item {
      display: flex;
      margin: .8rem 1.5rem 1rem 0;
      span {
        text-align: right;
        width: 80px;
        height: 30px;
        line-height: 30px;
      }
      .input-item {
        width: calc(100% - 80px);
        padding: .3rem .5rem;
        border: 1px solid $border-color;
        color: $black;
        &:hover {
          border-color: $black;
        }
        &:focus {
          border-color: $black;
        }
      }
    }

    .tool {
      text-align: right;
      button {
        margin-right: 1.5rem;
      }
    }
  }
}
@keyframes publishBtn {
  0%   {
    color: white;
    background: rgb(179, 151, 217);
  }
  12%  {
    color: white;
    background: rgb(128, 212, 224);
  }
  24%  {
    color: white;
    background: rgb(242, 141, 160);
  }
  36%  {
    color: white;
    background: rgb(97, 95, 245);
  }
  60% {
    color: white;
    background: rgb(133, 181, 240);
  }
  72% {
    color: white;
    background: rgb(229, 262, 110);
  }
  86% {
    color: white;
    background: rgb(148, 194, 165);
  }
  100% {
    color: white;
    background: rgb(123, 194, 172);
  }
}
</style>