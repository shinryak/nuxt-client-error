import path from 'path'
export default function(moduleOptions) {
  this.addPlugin(path.join(__dirname, 'plugins/main.js'))
}
