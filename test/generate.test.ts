import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { buildNuxt, createResolver, loadNuxt } from '@nuxt/kit'

describe('generate', () => {
  it('basic', async () => {
    process.env.NODE_ENV = 'production'
    process.env.prerender = true
    const { resolve } = createResolver(import.meta.url)
    const rootDir = resolve('../.playground')
    const nuxt = await loadNuxt({
      rootDir,
      overrides: {
        _generate: true,
      },
    })

    await buildNuxt(nuxt)

    await new Promise(resolve => setTimeout(resolve, 1000))

    const sitemap = await readFile(resolve(rootDir, '.output/public/sitemap.xml'), 'utf-8')
    expect(sitemap).toMatchInlineSnapshot('"<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?><urlset xmlns=\\"http://www.sitemaps.org/schemas/sitemap/0.9\\" xmlns:news=\\"http://www.google.com/schemas/sitemap-news/0.9\\" xmlns:xhtml=\\"http://www.w3.org/1999/xhtml\\" xmlns:image=\\"http://www.google.com/schemas/sitemap-image/1.1\\" xmlns:video=\\"http://www.google.com/schemas/sitemap-video/1.1\\"><url><loc>http://localhost:3000/</loc></url><url><loc>http://localhost:3000/about</loc><lastmod>2023-01-21T08:50:52.000Z</lastmod><changefreq>daily</changefreq><priority>0.3</priority></url><url><loc>http://localhost:3000/users-test</loc></url><url><loc>http://localhost:3000/users-test/1</loc><lastmod>2023-01-21T08:50:52.000Z</lastmod><changefreq>weekly</changefreq><priority>0.3</priority></url><url><loc>http://localhost:3000/users-test/2</loc><lastmod>2023-01-21T08:50:52.000Z</lastmod><changefreq>weekly</changefreq><priority>0.3</priority></url><url><loc>http://localhost:3000/hidden-path-but-in-sitemap</loc></url></urlset>"')
  }, 60000)

  it('trailing slash', async () => {
    process.env.NODE_ENV = 'production'
    process.env.prerender = true
    const { resolve } = createResolver(import.meta.url)
    const rootDir = resolve('../.playground')
    const nuxt = await loadNuxt({
      rootDir,
      overrides: {
        _generate: true,
      },
    })

    nuxt.options.sitemap = nuxt.options.sitemap || {}
    nuxt.options.sitemap.trailingSlash = true

    await buildNuxt(nuxt)

    await new Promise(resolve => setTimeout(resolve, 1000))

    const sitemap = await readFile(resolve(rootDir, '.output/public/sitemap.xml'), 'utf-8')
    expect(sitemap).toMatchInlineSnapshot('"<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?><urlset xmlns=\\"http://www.sitemaps.org/schemas/sitemap/0.9\\" xmlns:news=\\"http://www.google.com/schemas/sitemap-news/0.9\\" xmlns:xhtml=\\"http://www.w3.org/1999/xhtml\\" xmlns:image=\\"http://www.google.com/schemas/sitemap-image/1.1\\" xmlns:video=\\"http://www.google.com/schemas/sitemap-video/1.1\\"><url><loc>http://localhost:3000/</loc></url><url><loc>http://localhost:3000/about/</loc><lastmod>2023-01-21T08:50:52.000Z</lastmod><changefreq>daily</changefreq><priority>0.3</priority></url><url><loc>http://localhost:3000/users-test/</loc></url><url><loc>http://localhost:3000/users-test/1/</loc><lastmod>2023-01-21T08:50:52.000Z</lastmod><changefreq>weekly</changefreq><priority>0.3</priority></url><url><loc>http://localhost:3000/users-test/2/</loc><lastmod>2023-01-21T08:50:52.000Z</lastmod><changefreq>weekly</changefreq><priority>0.3</priority></url><url><loc>http://localhost:3000/hidden-path-but-in-sitemap/</loc></url></urlset>"')
  }, 60000)
})
