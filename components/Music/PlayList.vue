<template>
<transition name="list-fade">
  <div class="play-list" v-click-outside="hide" v-show="showFlag">
    <div class="list-wrapper">
      <h3 class="title">播放列表</h3>
      <div class="header">
        <span class="total">共 {{ 1 }} 首</span>
        <span class="mode" @click="changeMode" :class="modeIcon">改</span>
        <div class="clear">
          <i class="iconfont icon-clear"></i>
          <span>清空全部</span>
        </div>
      </div>
      <div class="list-content">
        <transition-group name="list" tag="ul">
          <li class="song-item" v-for="(item, index) in sequenceList" :key="item.id" @click="selectItem(index)">
            <i class="iconfont" :class="{'icon-current' : currentIndex === index}"></i>
            <span class="text no-wrap">{{item.name}}</span>
            <span class="singer no-wrap">{{item.singer}}</span>
            <i class="iconfont icon-guanbi" @click="deleteOne(item)"></i>
          </li>
        </transition-group>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { shuffle } from '../../utils/random'
export default {
  name: 'play_list',
  data() {
    return {
      showFlag: false
    }
  },
  computed: {
    modeIcon() {
      if (this.mode === 0) {
        return 'icon-sequence'
      } else if (this.mode === 1) {
        return 'icon-danquxunhuan'
      } else {
        return 'icon-random'
      }
    },
    ...mapState('music', {
      sequenceList: state => state.sequenceList,
      playList: state => state.playList,
      mode: state => state.mode,
      currentIndex: state => state.currentIndex,
      playing: state => state.playList
    }),
    ...mapGetters('music', [
      'currentSong'
    ])
  },
  methods: {
    hide() {
      this.$emit('update:visible', false)
    },
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setMode(mode)
      let list = null
      if (this.mode === 2) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    // 打乱后需要重新设置播放歌曲的索引
    resetCurrentIndex(list) {
      let index = list.findIndex(item => item.id === this.currentSong)
      this.setCurrentIndex(index)
    },
    selectItem(index) {
      this.setCurrentIndex(index)
    },
    /* currentIcon(index) {
      if (this.currentIndex === index) {
        return 'icon-current'
      }
    }, */
    deleteOne(index) {
      let list = this.sequenceList.splice(index, 1)
      this.setSequenceList(list)
    },
    clearPlayList() {
      this.setSequenceList([])
      this.$emit('stop')
    },
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
    ...mapMutations('music', {
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_MODE',
      setPlayList: 'SET_PLAY_LIST',
      setSequenceList: 'SET_SEQUENCE_LIST'
    }),
    ...mapActions('music', [
      'sequencePlay'
    ])
  }
}
</script>

<style lang="scss" scoped>
.play-list {
  position: absolute;
  left: 0;
  bottom: 100%;
  width: 100%;
  z-index: 200;
  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    transform: translateY(0);
    border-radius: 8px;
    background: $white;
    box-shadow: 0 0 20px rgba(0, 0, 0, .3);
    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: all .3s;
    }
    &.list-fade-enter, &.list-fade-leave-to {
      transform: translate3d(0, 100%, 0);
    }
    .title {
      width: 100%;
      padding: 20px 10px;
      text-align: center;
    }
    .header {
      position: relative;
      padding: 20px 30px 10px 20px;
      display: flex;
      align-items: center;
      .total {
        margin: 10px;
        font-size: 1rem;
      }
      .mode {
        flex: 1;
      }
      .clear {
        .icon-close {
          margin-right: .85rem;
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow-y: auto;
      .song-item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        font-size: $font-size-small;
        .text {
          flex: 0 0 60px;
          line-height: 20px;
        }
        .singer {
          flex: 1;
          margin-right: 10px;
          word-break: break-all;
        }
      }
    }
  }
}
</style>