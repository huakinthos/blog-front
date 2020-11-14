import api from '../api'

export const state = () => ({
  data: {
    list: [],
    pagination: {}
  },
  fetching: false,
  posting: false
})

export const mutations = {
  // 获取列表
  GET_LIST(state) {
    state.fetching = true
  },
  // 清空列表
  CLEAR_LIST(state) {
    state.data = {
      list: [],
      pagination: {}
    }
  },
  // 获取列表的状态
  GET_LIST_SUCCESS(state, res) {
    state.fetching = false
    state.data = res
  },
  GET_LIST_FAIL(state) {
    state.fetching = false
    state.data = {
      list: [],
      pagination: {}
    }
  },
  // 发布评论
  POST_COMMENT(state) {
    state.posting = true
  },
  POST_COMMENT_SUCCESS(state, res) {
    state.posting = false
    state.data.pagination.total += 1
    state.data.list.unshift(res)
  },
  POST_COMMENT_FAIL(state) {
    state.posting = false
  },
  LIKE_COMMENT(state, res) {
    let comment = state.data.list.find(item => item._id === res._id)
    if (comment) comment.likes++
  }
}

export const actions = {
  async postComment({ commit }, data) {
    commit('POST_COMMENT')
    let res = await api.api_postComment(data)
    if (res && res.code === 200) {
      commit('POST_COMMENT_SUCCESS', res.data)
      // if (data.refer_id !== 0) commit('article/ADD_COMMENT', null, { root: true })
    } else {
      commit('POSY_COMMENT_FAIL')
    }
    return res
  },
  // 通过 refer-id获取
  async getCommentList({ commit, state }, data) {
    data.sort = data.sort || -1
    data.current_page = data.current_page || 1
    data.page_size = data.page_size || 100
    commit('GET_LIST')
    let res = await api.api_getComment(data)
    if (res && res.code === 200) {
      let list
      if (res.data.pagination.current_page === 1) list = res.data.list
      else list = [...state.data.list, ...res.data.list]
      commit('GET_LIST_SUCCESS', {
        list,
        pagination: res.data.pagination
      })
    } else {
      commit('GET_LIST_FAIL')
    }
    return res
  },
  async likeComment({ commit }, data) {
    let res = await api.api_likeComment({ ...data, type: 1 })
    if (res && res.code === 200) {
      commit('LIKE_COMMENT', res.data)
    }
    return res
  }
}