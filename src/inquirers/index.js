const inquirer = require('inquirer')
const { plugins } = require('../constants')

const branchInquirer = async (branches) => {
  const { branch } = await inquirer.prompt([
    {
      name: 'branch',
      type: 'list',
      message: 'please choices a branches',
      choices: branches,
    },
  ])

  return branch
}

const repoInquirer = async (repos) => {
  const { repo } = await inquirer.prompt([
    {
      name: 'repo',
      type: 'list',
      message: 'please choices a template',
      choices: repos,
    },
  ])

  return repo
}

const installPluginsInquirer = async () => {
  const answers = await inquirer.prompt([
    {
      name: 'plugins',
      type: 'checkbox',
      message: 'please choices plugin',
      choices: plugins,
    },
  ])

  return answers.plugins
}

module.exports = {
  branchInquirer,
  repoInquirer,
  installPluginsInquirer,
}
