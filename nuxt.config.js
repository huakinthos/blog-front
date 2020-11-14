
module.exports = {
  mode: 'universal',

  server: {
    port: 3000, // default: 3000
    host: 'localhost' // default: localhost
  },
  /*
  ** Headers of the page
  */
  head: {
    title: '我的博客前端',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '我的博客前端' },
      { hid: 'keywords', name: 'keywords', content: '前端, javascript, nuxt, vue' },
      { name: 'author', content: '1628331231@qq.com' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    noscript: [
      { innerHTML: 'this website require JavaScript' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#20A0FF' },
  /*
  ** Global CSS
  */
  css: [
    {
      src: './assets/scss/index.scss',
      lang: 'sass'
    }
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {
      src: '~/plugins/marked.js'
    },
    {
      src: '~/plugins/highlight.js'
    },
    {
      src: '~/plugins/clickOutside.js',
      ssr: false
    },
    {
      src: '~/plugins/filter.js'
    }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/style-resources'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  styleResources: {
    scss: ['./assets/scss/variable.scss']
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
