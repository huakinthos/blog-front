<template>
  <div class="music-search">
    <div class="search" :class="{ 'active': search_active }">
      <input
        class="search-input"
        type="text"
        placeholder="想听的音乐?"
        v-model="keyword"
        @keydown.enter="searchSong">
      <div class="search-history">
        <span
          class="search-item "
          v-for="(item, index) in searchHistory"
          :key="index">
          <span class="keyword" @click="clickSearchItem(item)">{{ item }}</span>
          <i class="iconfont icon-guanbi" @click="delSearchItem(item)"></i>
        </span>
      </div>
    </div>
    <div class="search-list" v-if="listDetail">
      <music-list :songs="listDetail" @select="selectItem"></music-list>
    </div>
  </div>
</template>

<script>

import api from '../../api'
import { mapState, mapMutations, mapActions } from 'vuex'
import { createSrearchSong } from '../../utils/musicSong'
import MusicListVue from '../../components/Music/MusicList.vue'
import { saveSearch, deleteSearch, loadSearch, clearSearch } from '../../utils/musicCache'
export default {
  name: 'search',
  data() {
    return {
      listDetail: [],
      searchHistory: [],
      keyword: '',
      search_active: false
    }
  },
  computed: {
    ...mapState({
      playList: state => state.music.playList
    })
  },
  created() {
    this.searchHistory = loadSearch()
  },
  methods: {
    async searchSong() {
      if (this.keyword === '') return alert('缺少关键词!')
      this.search_active = true
      saveSearch(this.keyword)
      this.searchHistory = loadSearch()
      const res = await api.api_searchSong({ keyword: this.keyword })
      if (res.code === 200) {
        this.listDetail = res.data.result.songs.map(item => {
          return createSrearchSong(item)
        })
      } else {
        console.log(res.message)
      }
    },
    selectItem(index) {
      this.selectPlay({ list: this.listDetail, index })
    },
    clickSearchItem(keyword) {
      this.keyword = keyword
      this.searchSong()
    },
    delSearchItem(keyword) {
      const index = this.searchHistory.findIndex(item => item === keyword)
      this.searchHistory.splice(index, 1)
      deleteSearch(keyword)
    },
    clearSearchHistory() {
      clearSearch()
    },
    ...mapMutations({
      setCurrentIndex: 'music/SET_CURRENT_INDEX'
    }),
    ...mapActions({
      selectPlay: 'music/selectPlay'
    })
  },
  components: {
    'music-list': MusicListVue
  }
}
</script>

<style lang="scss" scoped>
.music-search {
  width: $container-music-width;
  margin: 0 auto;
  overflow: hidden;
  .search {
    width: 100%;
    margin-top: 20%;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4rem;
    transition: all .3s;
    &.active {
      margin-top: .85rem;
    }
    .search-input {
      background: transparent;
      width: 320px;
      height: 36px;
      font-size: $font-size-large;
      border: none;
      outline: none;
      text-align: center;
      border-bottom: 1px solid $border-color;
      color: $border-color;
    }
    .search-history {
      display: flex;
      align-items: center;
      background: transparent;
      width: 400px;
      .search-item {
        position: relative;
        display: inline-block;
        display: flex;
        padding: 10px 20px;
        margin-right: 10px;
        border-radius: 8px;
        background: $code-bg;
        color: $text;
        .keyword {
          margin-right: 5px;
        }
        .icon-guanbi {
          font-size: $font-size-small;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: $white;
          cursor: pointer
        }
      }
    }
  }
  .search-list {
    top: 100px;
  }
}
</style>