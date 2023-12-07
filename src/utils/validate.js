const { exec } = require('child_process')

function isGitUrlValid(url) {
  // 这里可以添加更多的URL格式检查，例如检查是否有`.git`后缀等。
  return Promise.resolve(/https?:\/\/.+\..+/.test(url))
}

function isGitRepositoryEmpty(url) {
  return new Promise((resolve, reject) => {
    exec(`git ls-remote ${url}`, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else {
        resolve(stdout.trim().length === 0)
      }
    })
  })
}

module.exports = async (url) => {
  try {
    await isGitUrlValid(url)
    const isEmpty = await isGitRepositoryEmpty(url)
    if (!isEmpty) {
      return false
    }
    return true
  } catch (err) {
    console.error(err.message)
    return false
  }
}
