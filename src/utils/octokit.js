const { Octokit } = require('@octokit/rest')
const fetch = require('node-fetch')
const git = require('simple-git')
const fs = require('fs')
const ora = require('ora')
const rimraf = require('rimraf')
const { formatPath } = require('.')
const { authToken, templatesDir } = require('../constants')
const { repoInquirer, branchInquirer } = require('../inquirers/index')

const octokit = new Octokit({
  auth: authToken,
  request: {
    fetch,
  },
})

const getReposListForOctokit = async () => {
  const result = await octokit.repos.listForOrg({
    org: 'shine-templates',
    type: 'public',
  })

  return result.data
}

const getBranchesListForOctokit = async (repo) => {
  const result = await octokit.repos.listBranches({
    owner: 'shine-templates',
    repo,
    per_page: 100,
  })

  return result.data
}

module.exports = async () => {
  const spinner = ora('git clone……')
  try {
    const repos = await getReposListForOctokit()
    const repo = await repoInquirer(repos.map((item) => item.name)),
      branches = await getBranchesListForOctokit(repo),
      branch = await branchInquirer(branches)
    spinner.start()
    const [{ clone_url }] = repos.filter((item) => item.name === repo)
    const projectPath = formatPath(`${templatesDir}${repo}-${branch}`)
    await git().clone(clone_url, `${projectPath}`, ['-b', branch])
    const dir = fs.readdirSync(projectPath)
    if (dir.length > 0) {
      rimraf.sync(`${projectPath}/.git`)
    }
    spinner.succeed('Clone completed!')
    return projectPath
  } catch (error) {
    spinner.fail('Clone failed!')
    throw error
  }
}
