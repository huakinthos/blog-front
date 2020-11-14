export const state = () => {
  return {
    // 是否音乐布局宽
    musicLayout: false,
    // 博主信息
    adminInfo: {},
    // 网站信息
    option: {}
  }
}

export const mutations = {
  SET_MUSIC_LAYOUT(state, flag) {
    state.musicLayout = flag
  },
  SET_ADMIN_INFO(state, data) {
    state.adminInfo = data
  }
}

export const actions = {

}