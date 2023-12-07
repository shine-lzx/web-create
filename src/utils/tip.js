const chalk = require('chalk')
const log = console.log

module.exports = (projectName) => {
  const instructions = `
    ${chalk.green('cd')} ${chalk.cyan(projectName)}
    ${chalk.green('npm run start')}
  `
  log(instructions)
}
