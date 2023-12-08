const { exec } = require('child_process')
const path = require('path')
const chalk = require('chalk')
const fs = require('fs')
const log = console.log

function getPackageManager(projectDir) {
  const packageLockPath = path.join(projectDir, 'package-lock.json')
  const yarnLockPath = path.join(projectDir, 'yarn.lock')

  if (fs.existsSync(packageLockPath)) {
    return 'npm install'
  } else if (fs.existsSync(yarnLockPath)) {
    return 'yarn'
  } else {
    return 'npm install'
  }
}

/**
 * 安装包
 * @param {string} packageName - 要安装的包名
 * @param {string} projectDir - 项目目录
 * @returns {Promise} - 返回一个Promise对象，包含安装结果
 */
function installPackage(packageName, projectDir, packageManager) {
  const currentPackageManager =
    packageManager === 'yarn'
      ? `yarn add ${packageName} --save`
      : `npm install --save ${packageName}`
  return new Promise((resolve, reject) => {
    exec(
      currentPackageManager,
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

  const packageManager = getPackageManager(projectDir)

  if (packages.length === 0) {
    log(
      chalk.blue(
        `No additional packages to install. Running default ${packageManager}...`
      )
    )
    return new Promise((resolve, reject) => {
      exec(
        packageManager,
        { cwd: path.join(projectDir) },
        (error, stdout, stderr) => {
          if (error) {
            reject(error)
          } else {
            resolve(`Default ${packageManager} completed successfully.`)
          }
        }
      )
    })
  }

  const installPromises = packages.map(async (packageName) => {
    try {
      await installPackage(packageName, projectDir, packageManager)
      log(chalk.green(`Successfully installed ${packageName}`))
    } catch (err) {
      log(chalk.red(`Failed to install ${packageName}:`, err))
    }
  })

  return Promise.all(installPromises)
}

module.exports = {
  installPackages,
}
