const path = require('path')
const rimraf = require('rimraf')
const esbuild = require('esbuild')
const fs = require('fs')

const outputDir = path.join(__dirname, 'dist')
rimraf.sync(outputDir)
fs.mkdirSync(outputDir, { recursive: true })

esbuild
  .build({
    entryPoints: [
      'src/index.js',
      'src/actions/config.js',
      'src/actions/create.js',
      'src/constants/index.js',
      'src/inquirers/index.js',
      'src/lib/Creator.js',
      'src/lib/Generator.js',
      'src/utils/download.js',
      'src/utils/installPlugins.js',
      'src/utils/request.js',
    ],
    bundle: true,
    outdir: 'dist',
    platform: 'node',
    target: 'node14',
    format: 'cjs',
  })
  .catch(() => process.exit(1))

// 将 package.json 复制到 dist 目录
fs.copyFileSync('./package.json', './dist/package.json')
