const builder = require('./builder.js')
try {
  builder()
  console.log('Packed! Generated bin and lib files')
} catch (error) {
  console.log('Packaging failed')
}
