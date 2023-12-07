const { templatesDir } = require('../constants')
const fs = require('fs')
const ora = require('ora')
const { confirmCleanInquirer } = require('../inquirers')
const chalk = require('chalk')
const log = console.log

module.exports = async () => {
  const spinner = ora('cleaning templates')
  if (!fs.existsSync(templatesDir)) {
    spinner.succeed('no templates directory found')
    return
  }

  try {
    const confirm = await confirmCleanInquirer()
    if (confirm) {
      const formatPath = templatesDir.replace(/\\/g, '/')
      const dir = fs.readdirSync(formatPath)
      spinner.start()
      if (dir.length > 0) {
        dir.forEach((item) => {
          fs.unlinkSync(`${formatPath}/${item}`)
        })
        spinner.succeed('cleaned templates successfully')
      } else {
        spinner.succeed('cleaning templates')
      }
    }
  } catch (error) {
    log(chalk.red(error))
    spinner.fail(
      'cleaning templates failed, please check your internet connection'
    )
  }
}
