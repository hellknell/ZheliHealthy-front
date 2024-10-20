import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import path from 'path'

import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(),
        AutoImport({
            resolver: [ElementPlusResolver()]
        }),
        Components({
            resolver: [ElementPlusResolver()]
        }),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), "src/icons/svg")],
            symbolId: '[name]'
        }),

    ],
    server: {
        host: "localhost",
        port: 7600,
        cors: true
    },
})
