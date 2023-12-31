const fs = require('fs')
const ora = require('ora')
const { repoInquirer, branchInquirer } = require('../inquirers/index')
const { templatesDir, githuburl } = require('../constants')
const request = require('./request')
const download = require('download')
const { formatPath } = require('.')

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
    const downloadUrl = `${url}/${repo}/archive/${branch}.zip`

    const fileName = `${repo}.zip`

    const filePath = formatPath(templatesDir)

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

const getLocalTemplatesDir = async (currentProjectName) => {
  const spinner = ora(`Checking local templates directory...`).start()
  const filePath = formatPath(templatesDir)
  spinner.succeed('Local templates directory exists!')
  return `${filePath}${currentProjectName}`
}

module.exports = async () => {
  try {
    const repos = await getReposList()
    const repo = await repoInquirer(repos.map((item) => item.name)),
      branches = await getBranchesList(repo),
      branch = await branchInquirer(branches)

    const currentProjectName = `${repo}-${branch}`
    ensureDirExists(templatesDir)
    const dir = fs.readdirSync(templatesDir)

    if (dir.length > 0 && dir.includes(currentProjectName)) {
      return getLocalTemplatesDir(currentProjectName)
    } else {
      return downloadFromGitHub(githuburl('templates'), repo, branch)
    }
  } catch (error) {
    throw error
  }
}
