export const actions = {
  nuxtInit(store, { req }) {
    const isServer = process && process.server
    // 获取用户设备信息
    const userAgent = isServer ? req.headers['user-agent'] : navigator.userAgent
    const isMobile = /(iPhone|iPod|Opera Mini|Android.*Mobile|NetFront|PSP|BlackBerry|Windows Phone)/gi.test(userAgent)
    console.log(isMobile)
  }
}