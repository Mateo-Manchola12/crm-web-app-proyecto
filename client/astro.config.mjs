// @ts-check
import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import htaccess from 'astro-htaccess'
import node from '@astrojs/node'

import icon from 'astro-icon'

import svelte from '@astrojs/svelte'

// https://astro.build/config
export default defineConfig({
    server: {
        host: true,
    },
    vite: {
        plugins: [tailwindcss()],
    },

    integrations: [react(), sitemap(), htaccess(), icon(), svelte()],

    adapter: node({
        mode: 'middleware',
    }),
})
