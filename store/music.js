import api from '../api'
import { loadFavorite, loadPlay, loadSearch, savePlay, saveFavorite, deleteFavorite } from '../utils/musicCache'
import { shuffle } from '../utils/random'
const playMode = {
  sequence: 0,
  loop: 1,
  random: 2
}

export const state = () => ({
  musicList: [],
  playList: [],
  sequenceList: [],
  currentIndex: -1,
  mode: playMode.sequence,
  playing: false,
  playHistory: loadPlay(),
  favoriteList: loadFavorite(),
  searchHistory: loadSearch(),
})

export const getters = {
  currentSong(state) {
    return state.playList[state.currentIndex]
  },
  async getCurrentSongUrl(state) {
    const res = await api.api_getSongUrl(state.playList[state.currentIndex])
    return res.data.data[0].url
  },
}

export const mutations = {
  GET_MUSIC_LIST(state, list) {
    state.musicList = list
  },
  // 当前播放的列表
  SET_PLAY_LIST(state, list) {
    state.playList = list
  },
  SET_SEQUENCE_List(state, list) {
    state.sequenceList = list
  },
  // 当前音乐的索引
  SET_CURRENT_INDEX(state, index) {
    state.currentIndex = index
  },
  // 当前音乐播放状态
  SET_PLAY_STATE(state, flag) {
    state.playing = flag
  },

  SET_PLAY_HISTORY(state, songs) {
    state.playHistory = songs
  },
  SET_FAVORITE_LIST(state, songs) {
    state.favoriteList = songs
  }
}

export const actions = {
  selectPlay({ state, commit }, { list, index }) {
    commit('SET_SEQUENCE_List', list)
    if (state.mode === 2) {
      let randomList = shuffle(list)
      commit('SET_PLAY_LIST', randomList)
      const index = randomList.findIndex(item => item.id === list[index].id)
    } else {
      commit('SET_PLAY_LIST', list)
    }
    commit('SET_CURRENT_INDEX', index)
    commit('SET_PLAY_STATE', true)
  },

  sequencePlay({ commit }, { list }) {
    commit('SET_MODE', playMode.sequence)
    commit('SET_SEQUENCE_LIST', list)
    commit('SET_PLAY_LIST', list)
    commit('SET_CURRENT_INDEX', 0)
    commit('SET_PLAY_SATTE', true)
  },

  async downloadSong({ state }) {
    const res = await api.api_getSongUrl(state.playList[state.currentIndex])
    return res.data.data[0].url
  },

  setPlayHistory(song) {
    commit('SET_PLAY_HISTORY', savePlay(song))
  },
  setFavoriteList(song) {
    commit('SET_FAVORITE_LIST', saveFavorite(song))
  },
  deleteFavorite(song) {
    commit('SET_FAVORITE_LIST', deleteFavorite(song))
  }
}