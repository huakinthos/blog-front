<template>
  <div class="music-list">
    <ul>
      <li v-for="(item, index) in songs" :key="index" class="item">
        <div class="song-name">
          {{ item.name }}
          <div class="tools">
            <span @click.stop="selectItem(index)">播放</span>
            <span @click="getSongUrl(item)">下载</span>
          </div>
        </div>
        <div class="song-art">{{ item.singer }}</div>
        <div class="song-album">{{ item.album }}</div>
        <div class="song-durantion">...</div>
      </li>
    </ul>
  </div>
</template>

<script>
import api from '../../api'
export default {
  name: 'music-list',
  props: ['songs'],
  methods: {
    selectItem(index) {
      this.$emit('select', index)
    },
    async getSongUrl(item) {
      const res = await api.api_getSongUrl(item)
      window.open(res.data.data[0].url, 'newWin')
    },
    getDesc(song) {
      if (song.aliaName) {
        return `${song.singer} - ${song.aliaName}`
      } else {
        return `${song.singer}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.music-list {
  .item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-weight: 400;
    color: $text;
    width: 100%;
    padding: 15px;
    border-bottom: 1px solid $border-color;
    > div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &.song-name {
          flex: 0 0 400px;
          margin: 0;
          padding-right: 120px;
          position: relative;
          &:hover {
            .tools {
              display: block;
            }
          }
          .tools {
            position: absolute;
            width: 120px;
            top: 0;
            right: 0;
            bottom: 0;
            display: none;
            span:hover {
              color: $black;
            }
          }
        }
        &.song-art {
          flex: 1 1 auto;
          margin: 0;
        }
        &.song-album {
          flex: 0 0 200px;
          text-align: left;
          margin: 0;
        }
        &.song-durantion {
          flex: 0 0 120px;
          text-align: right;
          margin: 0;
        }
    }
  }
}

</style>