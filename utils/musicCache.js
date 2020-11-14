import storage from 'good-storage'

const SEARCH_KEY = 'SEARCH_HISTORY'
const SEARCH_MAX_LEANGTH = 15

const PLAY_KEY = 'PLAY_HISTORY'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = 'FAVORITE_LIST'
const FAVORITE_MAX_LENGTH = 200

// 插入函数, 如果不为第一个则删除当前的存在的位置并添加到第一个
function insetArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare) // 调用时插入函数
  if (index === 0) return
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.lenght >= maxLen) {
    arr.pop()
  }
}

// 删除函数，如果存在则删除
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 已经播放的
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insetArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

// 最爱的
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insetArray(songs, song, item => {
    return item.id === song.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, item => {
    item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 搜索的
export function saveSearch(song) {
  let songs = storage.get(SEARCH_KEY, [])
  insetArray(songs, song, item => {
    return item === song
  }, SEARCH_MAX_LEANGTH)
  storage.set(SEARCH_KEY, songs)
  return songs
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function deleteSearch(song) {
  let songs = storage.get(SEARCH_KEY, [])
  deleteFromArray(songs, item => {
    return item === song
  })
  storage.set(SEARCH_KEY, songs)
  return songs
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}