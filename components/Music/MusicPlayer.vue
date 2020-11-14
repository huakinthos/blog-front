<template>
  <div class="music-player" v-show="playList">
    <div class="player" :class="playerShape">
      <div class="icon-circle">
        <img :src="currentSong.image || ''">
        <div class="circle-range"></div>
      </div>
      <div class="tools">
        <div class="background">
          <div class="filter"></div>
          <img :src="currentSong.image || ''" width="100%" height="100%">
        </div>
        <div class="control" @click="togglePlaying">
          <i class="iconfont" :class="miniIcon"></i>
        </div>
        <div class="next" @click="nextSong">
          <i class="iconfont icon-next"></i>
        </div>
        <div class="text">
          <h2 class="name" :title="currentSong.name">{{ currentSong.name }}</h2>
          <div class="singer" :title="currentSong.singer">{{ currentSong.singer }}</div>
        </div>
        <div class="like" @click="toggleFavorite(currentSong)">
          <i class="iconfont" :class="likeIcon(currentSong)"></i>
        </div>
        <div class="list" @click="showPlayList">
          <i class="iconfont icon-list">show</i>
        </div>
      </div>
      <play-list ref="playList" @stop="stopMusic"></play-list>
    </div>

    <audio id="music-audio" ref="audio" @ended="end" autoplay @canplay="ready" @error="error"></audio>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import api from '../../api/index'
import playList from './PlayList'
export default {
  name: 'player',
  data() {
    return {
      url: '',
      songReady: false, // 加载好保存到播放历史
      currentTime: 0,
      duration: 0,
      percent: 0,
      playerShape: 'rect'
    }
  },
  watch: {
    // currentIndex [改变] ==> currentSong [改变]  ==> getSongUrl(currentSong.id) ==> url [改变] ==> audio.src = url
    currentSong(newVal) {
      if (!newVal.id) return
      // if (newVal.id === oldVal.id) return
      this.$refs.audio.pause()
      this.$refs.audio.currentTime = 0
      this.getSongUrl(newVal.id)
    },
    url(newUrl) {
      this.$refs.audio.src = newUrl
      let timer = setInterval(() => {
        this.duration = this.$refs.audio.duration
        if (this.duration) {
          clearInterval(timer)
        }
      }, 150);
      this.setPlayState(true)
    },
    currentTime() {
      this.percent = this.currentTime / this.duration
    }
  },
  computed: {
    miniIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    ...mapState('music', {
      playList: state => state.playList,
      currentIndex: state => state.currentIndex,
      mode: state => state.mode,
      playing: state => state.playing,
      favoriteList: state => state.favoriteList
    }),
    ...mapGetters('music', [
      'currentSong'
    ])
  },
  methods: {
    likeIcon(song) {
      return this.isFavorite(song) ? 'icon-like': 'icon-dislike'
    },
    toggleFavorite(song) {
      this.isFavorite(song) ? this.deleteFavorite : this.setFavoriteList
    },
    isFavorite(song) {
      let index = this.playList.findIndex(item => item.id === song.id)
      return index > -1
    },
    nextSong() {
      let nextIndex = this.currentIndex + 1
      if (nextIndex === this.playList.length) nextIndex = 0
      this.setCurrentIndex(nextIndex)
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    togglePlaying() {
      this.setPlayState(!this.playing)
      this.$refs.audio.pause()
    },
    stopMusic() {
      this.$refs.audio.pause()
      console.log('没有歌曲了，快去添加吧!')
    },
    // audio的一些方法
    end() {
      if (this.mode === 1) {
        this.loop()
      } else {
        this.nextSong()
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
    },
    error() {
      this.songReady = true
    },
    ready() {
      this.songReady = true
      // this.setPlayHistory(this.currentSong)
    },
    showPlayList() {
      this.$refs.showPlayList.show()
    },
    async getSongUrl(id) {
      const res = await api.api_getSongUrl(id)
      this.url = res.data.data[0].url
    },
    ...mapMutations('music', {
      setPlayState: 'SET_PLAY_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    }),
    ...mapActions('music', [
      'setFavoriteList',
      'deleteFavorite',
      'setPlayHistory'
    ])
  },
  components: {
    'play-list': playList
  }
}
</script>

<style lang="scss" scoped>
.music-player {
  .player {
    position: fixed;
    left: 5rem;
    bottom: 5rem;
    width: 280px;
    height: 56px;
    z-index: 120;
    transition: all .3s;
    overflow: hidden;
    &.circle {
      width: 56px;
      border-radius: 50%;
      .icon-circle {
        transform: scale(1);
        visibility: visible;
      }
      .tools {
        opacity: 0;
        visibility: hidden;
        transition: all .5s;
      }
    }
    &.rect {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      border-radius: 10px;
      transform: translateZ(0);
      .icon-circle {
        transform: scale(.5);
        visibility: hidden;
      }
      .tools {
        opacity: 1;
        visibility: visible;
        transition: all .3s;
      }
    }
    .icon-circle {
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      opacity: 1;
      transition: all .3s;
      animation: rotate 8s linear infinite;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
      .circle-range {
        position: absolute;
        left: 0;
        top: 0;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: 3px solid rgba(201, 202, 206, 0.36)
      }
    }
    .tools {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      padding: 4px 6px;
      transform: translateZ(0);
      z-index: 5;
      overflow: hidden;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: .6;
        filter: blur(30px);
        .filter {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.6;
        }
      }
      .control, .next {
        flex: 0 0 40px;
        width: 36px;
        height: 36px;
        cursor: pointer;
        background: rgba(0, 0, 0, .18);
        border-radius: 50%;
        transition: background-color .3s;
      }
      .text {
        flex: 1 1 auto;
        margin: 0 10px;
        height: 100%;
        overflow: hidden;
        color: #fff;
        display: flex;
        flex-direction: column;
        visibility: visible;
        cursor: default;
        .name, .singer {
          padding: 1px 0;
          font-weight: 200;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
          width: 100%;
        }
        .name {
          font-size: $font-size-base;
        }
        .singer {
          font-size: $font-size-small;
          color: rgba(100%, 100%, 100%, .8);
          margin: 0 0 4px;
        }
      }
      .like, .list {
        flex: 0 0 40px;
        width: 36px;
        height: 36px;
        cursor: pointer;
      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0)
    }
    100% {
      transform: rotate(100%)
    }
  }
}
</style>