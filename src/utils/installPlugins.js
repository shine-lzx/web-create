const { exec } = require('child_process')
const path = require('path')
const chalk = require('chalk')
const log = console.log

/**
 * 安装包
 * @param {string} packageName - 要安装的包名
 * @param {string} projectDir - 项目目录
 * @returns {Promise} - 返回一个Promise对象，包含安装结果
 */
function installPackage(packageName, projectDir) {
  return new Promise((resolve, reject) => {
    exec(
      `npm install --save ${packageName}`,
      { cwd: path.join(projectDir) },
      (error, stdout, stderr) => {
        if (error) {
          reject(error)
        } else {
          resolve(`${packageName} installed successfully.`)
        }
      }
    )
  })
}

/**
 * 异步函数：安装包件
 * @param {Array} packages - 需要安装的包件数组
 * @param {string} projectDir - 项目目录
 * @returns {Promise} - 返回一个Promise对象，表示所有包件安装的异步操作
 */
async function installPackages(packages, projectDir) {
  if (!Array.isArray(packages)) {
    throw new TypeError('Expected packages to be an array')
  }

  if (typeof projectDir !== 'string') {
    throw new TypeError('Expected projectDir to be a string')
  }

  if (packages.length === 0) {
    log(
      chalk.blue(
        'No additional packages to install. Running default npm install...'
      )
    )
    return new Promise((resolve, reject) => {
      exec(
        'npm install',
        { cwd: path.join(projectDir) },
        (error, stdout, stderr) => {
          if (error) {
            reject(error)
          } else {
            resolve('Default npm install completed successfully.')
          }
        }
      )
    })
  }

  const installPromises = packages.map((packageName) => {
    return installPackage(packageName, projectDir)
      .then(() => {
        log(chalk.green(`Successfully installed ${packageName}`))
      })
      .catch((err) => {
        log(chalk.red(`Failed to install ${packageName}:`, err))
      })
  })

  return Promise.all(installPromises)
}

module.exports = {
  installPackages,
}
