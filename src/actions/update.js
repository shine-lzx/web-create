const execa = require('execa')
const Listr = require('listr')
const chalk = require('chalk')

module.exports = async () => {
  const updateCommands = [
    {
      title: '执行卸载指令',
      task: () => execa('npm', ['uninstall', 'web-create', '-g']),
    },
    {
      title: '执行安装指令',
      task: () => execa('npm', ['install', 'web-create', '-g']),
    },
  ]

  const tasks = new Listr(updateCommands)

  try {
    await tasks.run()
    console.log(chalk.green('更新成功'))
  } catch (err) {
    console.log('err: ', err)
    console.log(chalk.red('更新失败'))
  }
}
