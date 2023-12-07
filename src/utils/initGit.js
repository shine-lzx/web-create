const execa = require('execa')
const Listr = require('listr')
const path = require('path')
const fs = require('fs')
const isValidGitRepository = require('./validate')

function handleError(err) {
  console.error(`directory Error: ${err}`)
}

async function performGitTasks(url) {
  const gitCommands = [
    {
      title: '初始化 Git 仓库',
      task: () => execa('git init'),
    },
    {
      title: '添加远程仓库',
      task: () => execa('git remote add origin', [url]),
    },
    {
      title: '添加所有文件到暂存区',
      task: () => execa('git add *'),
    },
    {
      title: '提交更改',
      task: () => execa('git commit -m "Initial commit"'),
    },
    {
      title: '推送到远程仓库',
      task: () => execa('git push -u origin master'),
    },
  ]

  const tasks = new Listr(gitCommands)

  try {
    await tasks.run()
  } catch (err) {
    handleError(err)
  }
}

module.exports = async (projectDir, url) => {
  const projectPath = path.join(process.cwd(), projectDir)
  try {
    if (!fs.existsSync(projectPath)) {
      return
    }

    if (!url) {
      return
    }

    const isValidRepository = await isValidGitRepository(url)

    if (!isValidRepository) {
      return
    }

    process.chdir(projectPath)
    await performGitTasks(url)
  } catch (err) {
    handleError(err)
  }
}
