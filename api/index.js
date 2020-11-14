import instence from './axios'

export default {
  // 用户权限
  api_getAuth() {
    return instence.get('/auth').then(res => res.data)
  },
  // 留言
  api_getLeave(params) {
    return instence.get('/leave', { params }).then(res => res.data)
  },
  api_postLeave(data) {
    return instence.post('/leave', { ...data }).then(res => res.data)
  },

  // 文章列表
  api_getArtList(params) {
    return instence.get('/article', { params }).then(res => res.data)
  },
  // 根据id获取文章
  api_getArticle(params) {
    return instence.get(`/article/${params.id}`).then(res => res.data)
  },
  // 归档
  api_getArchive() {
    return instence.get('/archive').then(res => res.data)
  },
  api_likeArt(params) {
    return instence.post('/like', { ...params }).then(res => res.data)
  },

  // 获取标签
  api_getTag(params) {
    return instence.get('/getTag', params).then(res => res.data)
  },

  // 获取评论
  api_getComment(params) {
    return instence.get('/comment', { params }).then(res => res.data)
  },
  // 发布评论
  api_postComment(data) {
    return instence.post('/comment', { ...data }).then(res => res.data)
  },
  api_likeComment(params) {
    return instence.post('/like', params).then(res => res.data)
  },

  // 音乐相关
  api_getPlayList() {
    return instence.get('/music/list/751387161').then(res => res.data)
  },
  api_getSong(params) {
    return instence.get(`/music/song/${params.id}`).then(res => res.data)
  },
  api_getSongUrl(id) {
    return instence.get(`/music/url/${id}`).then(res => res.data)
  },
  api_getSongPic(params) {
    return instence.get(`/music/pic/${params.id}`).then(res => res.data)
  },
  api_searchSong(params) {
    return instence.get('/music', { params }).then(res => res.data)
  }
}