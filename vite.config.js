import vue from '@vitejs/plugin-vue2'
import laravel from "laravel-vite-plugin";

export default {
    base: '/',
    define: {
        'process.env': {},
    },
    build: {
        manifest:true,
        outDir: 'public/build',
        assetsDir: 'static',

    },
    // server: {
    //     proxy: {
    //         '/index.html': {
    //             target: 'http://localhost:8000/index.html',
    //             changeOrigin: true,
    //             secure: false,
    //         },
    //     }
    // },
    plugins: [
        laravel(['resources/js/app.js','resources/scss/app.scss']),
        vue({
            template: {
                transformAssetUrls: {
                    // The Vue plugin will re-write asset URLs, when referenced
                    // in Single File Components, to point to the Laravel web
                    // server. Setting this to `null` allows the Laravel plugin
                    // to instead re-write asset URLs to point to the Vite
                    // server instead.
                    base: null,

                    // The Vue plugin will parse absolute URLs and treat them
                    // as absolute paths to files on disk. Setting this to
                    // `false` will leave absolute URLs un-touched so they can
                    // reference assets in the public directory as expected.
                    includeAbsolute: false,
                },
            },
        }),
    ],
    resolve: {
        alias: {
            "@": "./resources/js",
        }
    }
}
