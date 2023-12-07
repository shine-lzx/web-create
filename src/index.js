const { Command } = require('commander')
const program = new Command()
const path = require('path')
const { version, actions } = require('./constants')

Reflect.ownKeys(actions).forEach((action) => {
  program
    .command(action)
    .alias(actions[action].alias)
    .description(actions[action].description)
    .action(() => {
      if (action === '*') {
        console.warn(actions[action].description)
      } else {
        require(path.resolve(__dirname, `actions/${action}`))(
          ...process.argv.slice(3)
        )
      }
    })
})

program.on('--help', () => {
  Reflect.ownKeys(actions).forEach((action) => {
    actions[action].examples.forEach((example) => {
      console.log(`${example}`)
    })
  })
})

program.version(version).parse(process.argv)
