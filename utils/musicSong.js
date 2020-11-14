export default class Song {
  constructor({ id, singer, name, album, image, aliaName }) {
    this.id = id
    this.singer = singer
    this.name = name
    this.album = album
    this.aliaName = aliaName
    // this.duration = duration
    this.image = image
    // this.url = url
  }
}

function singerName(arr) {
  let name = []
  name = arr.map(item => item.name)
  if (arr === undefined) return '群星'
  return name.join('/')
}

export function createSong(music) {
  return new Song({
    id: music.id,
    singer: singerName(music.ar),
    name: music.name,
    album: music.al.name,
    image: music.al.picUrl
  })
}

export function createSrearchSong(music) {
  return new Song({
    id: music.id,
    singer: singerName(music.ar),
    name: music.name,
    album: music.al.name,
    image: music.al.picUrl
  })
}