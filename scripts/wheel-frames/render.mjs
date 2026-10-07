// Renders the How it works wheel (wheel3d.js) into public/wheel/000.webp ...
// in a headless browser. Only needed when the wheel itself changes; the
// frames are committed.
//
// three and playwright are not project dependencies, so install them just
// for the run (Playwright's Chromium too, if it isn't already there):
//
//   npm i --no-save three playwright
//   npx playwright install chromium
//   node scripts/wheel-frames/render.mjs                 all frames
//   node scripts/wheel-frames/render.mjs preview 0,0.62  PNG stills of t
//
// The frame count and size must match WHEEL_FRAMES in src/App.jsx.
import { chromium } from 'playwright'
import http from 'node:http'
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const COUNT = 96
const WIDTH = 800
const HEIGHT = 667
const QUALITY = 0.75

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '../..')
const OUT = path.join(ROOT, 'public/wheel')

// A bare static server over the project, so the page can import three
// straight out of node_modules.
const TYPES = { '.html': 'text/html', '.js': 'text/javascript' }
const server = http.createServer(async (req, res) => {
  try {
    const file = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname))
    if (!file.startsWith(ROOT)) throw new Error('outside the project')
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404)
    res.end()
  }
}).listen(0)

// Software WebGL, so it runs the same with or without a GPU.
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const page = await browser.newPage()
page.on('pageerror', (e) => console.error('[page]', e))
await page.goto(`http://localhost:${server.address().port}/scripts/wheel-frames/index.html?w=${WIDTH}&h=${HEIGHT}`)
await page.waitForFunction(() => window.ready, null, { timeout: 60000 })

const decode = (dataUrl) => Buffer.from(dataUrl.split(',')[1], 'base64')
const [mode, times] = process.argv.slice(2)

if (mode === 'preview') {
  const dir = path.join(HERE, 'preview')
  await mkdir(dir, { recursive: true })
  for (const t of times.split(',').map(Number)) {
    const url = await page.evaluate((t) => window.renderFrame(t, 1, 'image/png'), t)
    await writeFile(path.join(dir, `t-${t}.png`), decode(url))
    console.log(`preview/t-${t}.png`)
  }
} else {
  await rm(OUT, { recursive: true, force: true })
  await mkdir(OUT, { recursive: true })
  let total = 0
  for (let i = 0; i < COUNT; i++) {
    const buf = decode(await page.evaluate(([t, q]) => window.renderFrame(t, q), [i / (COUNT - 1), QUALITY]))
    total += buf.length
    await writeFile(path.join(OUT, `${String(i).padStart(3, '0')}.webp`), buf)
    if (i % 12 === 0) console.log(`frame ${i + 1}/${COUNT}`)
  }
  console.log(`${COUNT} frames, ${(total / 1024 / 1024).toFixed(2)} MB`)
}

await browser.close()
server.close()
