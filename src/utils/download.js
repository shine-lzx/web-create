const fs = require('fs')
const ora = require('ora')
const { repoInquirer, branchInquirer } = require('../inquirers/index')
const { templatesDir, githuburl } = require('../constants')
const request = require('./request')
const download = require('download')

const getReposList = async () => {
  try {
    return await request(githuburl('repos'))
  } catch (error) {
    if (error.data) {
      throw error.data
    }
    throw error
  }
}

const getBranchesList = async (repo) => {
  try {
    return await request(githuburl('branches', repo))
  } catch (error) {
    if (error.data) {
      throw error.data
    }
    throw error
  }
}

const downloadFromGitHub = async (url, repo, branch) => {
  const spinner = ora(`Downloading……`).start()
  try {
    ensureDirExists(templatesDir)

    const downloadUrl = `${url}/${repo}/archive/${branch}.zip`

    const fileName = `${repo}.zip`

    const filePath = templatesDir.replace(/\\/g, '/')

    const downloadOptions = {
      extract: true,
      mode: '666',
      filename: fileName,
    }

    await download(downloadUrl, templatesDir, downloadOptions)

    spinner.succeed('Download completed!')

    return `${filePath}${repo}-${branch}`
  } catch (err) {
    spinner.fail('Download failed')
    throw err
  }
}

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true })
      return true
    } catch (err) {
      return false
    }
  }

  return true
}

module.exports = async () => {
  try {
    const repos = await getReposList()
    const repo = await repoInquirer(repos.map((item) => item.name)),
      branches = await getBranchesList(repo),
      branch = await branchInquirer(branches)
    return downloadFromGitHub(githuburl('templates'), repo, branch)
  } catch (error) {
    throw error
  }
}
