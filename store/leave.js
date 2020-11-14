import api from '../api'

export const state = () => ({
  data: {
    list: [],
    pagination: {}
  },
  fetch: false,
  posting: false
})

export const mutations = {
  FETCH_LEAVE(state) {
    state.fetch = true
  },
  GET_LEAVE_SUCCESS(state, data) {
    state.data = data
    state.fetch = false
  },
  GET_LEAVE_FALE(state) {
    state.data = {
      list: [],
      pagination: {}
    }
    state.fetch = false
  },

  // 提交留言
  POST_LEAVE(state) {
    state.posting = true
  },
  POST_LEAVE_END(state) {
    state.posting = false
  }
}

export const actions = {
  async getLeave({ commit, state }, data = { current_page: 1 }) {
    commit('FETCH_LEAVE')
    const res = await api.api_getLeave(data)
    if (res.code === 200) {
      let list
      if (res.data.pagination.current_page === 1) {
        list = res.data.list
      } else {
        list = [...state.data.list, ...res.data.list]
      }
      commit('GET_LEAVE_SUCCESS', { list, pagination: res.data.pagination })
    } else {
      commit('GET_LEAVE_FALE')
    }
    return res
  },

  async postLeave({ commit }, data) {
    commit('POST_LEAVE')
    const res = await api.api_postLeave(data)
    if (res.code === 200) {
      alert(res.message)
    } else console.log(res.message)
    commit('POST_LEAVE_END')
    return res
  }
}