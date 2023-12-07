const download = require('../utils/download')
const ora = require('ora')
const Generator = require('./Generator')
const { installPluginsInquirer } = require('../inquirers')
const { installPackages } = require('../utils/installPlugins')
const initGit = require('../utils/initGit')
const initHusky = require('../utils/initHusky')

class Creator {
  constructor(projectName) {
    this.projectName = projectName
    this.getTemplate()
  }

  async getTemplate() {
    try {
      const template = await download()
      await this.generateProject(template)
    } catch (err) {
      throw err
    }
  }

  async generateProject(template) {
    const repoUrl = await Generator(template, this.projectName)
    const plugins = await this.choosePlugins()
    await this.installDependencies(plugins)
    // await initHusky(plugins, this.projectName)
    await initGit(this.projectName, repoUrl)
  }

  async choosePlugins() {
    return installPluginsInquirer()
  }

  async installDependencies(plugins) {
    // 如果用户未选择任何额外的插件，这块代码将会不执行，需要增加判断
    const spinner = ora('Installing dependencies...').start()
    try {
      await installPackages(plugins, this.projectName)
      spinner.succeed('Dependencies installed successfully!')
    } catch (err) {
      spinner.fail('Failed to install dependencies!')
    }
  }
}

module.exports = {
  Creator,
}
