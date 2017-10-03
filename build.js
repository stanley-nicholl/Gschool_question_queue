const path = require('path')
const fse = require('fs-extra')
const dev = {
  assets: path.join(__dirname, 'assets'),
  bundle: path.join(__dirname, 'scripts', 'bundle.js'),
  index: path.join(__dirname, 'index.html')
}
const dist = {
  assets: path.join(__dirname, 'dist', 'assets'),
  main: path.join(__dirname, 'dist'),
  scripts: path.join(__dirname, 'dist', 'scripts')
}

fse.ensureDirSync(dist.main)
fse.ensureDirSync(dist.scripts)

fse.copySync(dev.index, path.join(dist.main, 'index.html'))
fse.copySync(dev.assets, dist.assets)
fse.copySync(dev.bundle, path.join(dist.scripts, 'bundle.js'))

console.log(`Finished build.`)
