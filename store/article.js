import api from '../api'

export const state = () => ({
  // 文章列表
  data: {
    list: [],
    pagination: {}
  },
  hotArt: {
    list: [],
    pagination: {}
  },
  // 单个文章
  article: {},
  fatch: false
})

export const mutations = {
  // 获取文章列表
  PATCH_ART(state) {
    state.fetch = true
  },
  GET_LIST_SUCCESS(state, res) {
    state.data = res
    state.fetch = false
  },
  GET_LIST_FAIL(state) {
    state.data = {
      list: [],
      pagination: {}
    }
  },
  // 根据最热排序
  GET_HOTLIST(state, res) {
    state.hotArt = res
  },

  // 获取单个文章
  GET_ARTICLE(state, res) {
    state.article = res
  },

  // 给文章添加评论
  ADD_COMMENT(state) {
    state.article.meta.comments += 1
  }
}

export const actions = {
  async getArticleList({ commit }, data = { current_page: 1 }) {
    commit('PATCH_ART')
    let res = await api.api_getArtList({ ...data, page_size: data.page_size || 6 })
    if (res && res.code === 200) {
      commit('GET_LIST_SUCCESS', res.data)
    } else commit('GET_LIST_FAIL')
  },

  async getHotList({ commit }) {
    let res = await api.api_getArtList({ hot: true })
    commit('GET_HOTLIST', res.data)
  },

  async getArticle({ commit }, params) {
    const res = await api.api_getArticle(params)
    commit('GET_ARTICLE', res.data)
  },

  async likeArt({ }, params) {
    const res = await api.api_likeArt({ ...params, type: 0 })
    return res
  }
}