const path = require('path')
const fse = require('fs-extra')
const dev = {
  assets: path.join(__dirname, 'assets'),
  bundle: path.join(__dirname, 'scripts', 'bundle.js'),
  index: path.join(__dirname, 'index.html'),
  pages: path.join(__dirname, 'pages')
}
const dist = {
  assets: path.join(__dirname, 'dist', 'assets'),
  pages: path.join(__dirname, 'dist', 'pages'),
  main: path.join(__dirname, 'dist'),
  scripts: path.join(__dirname, 'dist', 'scripts')
}

fse.ensureDirSync(dist.main)
fse.ensureDirSync(dist.scripts)

fse.copySync(dev.index, path.join(dist.main, 'index.html'))
fse.copySync(dev.pages, dist.pages)
fse.copySync(dev.assets, dist.assets)
fse.copySync(dev.bundle, path.join(dist.scripts, 'bundle.js'))

console.log(`Finished build.`)
