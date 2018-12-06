const pkg = require('./package')

module.exports = {
    mode: 'universal',

    /*
    ** Headers of the page
    */
    head: {
        title: pkg.name,
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: pkg.description }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },

    /*
    ** Global CSS
    */
    css: [
        'iview/dist/styles/iview.css'
    ],

    /*
    ** Plugins to load before mounting the App
    */
    plugins: [{
        src: '~/plugins/iview.js', ssr: true
    }, {
        src: '~/plugins/api.js', ssr: true
    }, {
        src: '~/plugins/axios.js', ssr: true
    }, {
        src: '~/plugins/route.js', ssr: true
    }],

    /*
    ** Nuxt.js modules
    */
    modules: [
        // Doc: https://github.com/nuxt-community/axios-module#usage
        '@nuxtjs/axios'
    ],
    /*
    ** Axios module configuration
    */
    axios: {
        //baseURL: 'http://localhost:7001',
        baseURL: 'http://101.132.131.9',
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        // See https://github.com/nuxt-community/axios-module#options
    },

    /*
    ** Build configuration
    */
    build: {
        /*
        ** You can extend webpack config here
        */
        extend(config, ctx) {
            // Run ESLint on save
            // if (ctx.isDev && ctx.isClient) {
            //     config.module.rules.push({
            //         enforce: 'pre',
            //         test: /\.(js|vue)$/,
            //         loader: 'eslint-loader',
            //         exclude: /(node_modules)/
            //     })
            // }
        }
    },
    router: {
    }
}
