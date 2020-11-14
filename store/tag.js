import api from '../api'

export const state = () => ({
  data: {
    list: [],
    pagination: {}
  }
})

export const mutations = {
  GET_TAG(state, res) {
    state.data = res
  }
}

export const actions = {
  async getTag({ commit }) {
    let res = await api.api_getTag({ page_size: 40 })
    commit('GET_TAG', res.data)
  }
}