const os = require('os')
const { version } = require('../../package.json')

const templatesDir = `${os.homedir()}/.web-cli-templates/`

const actions = {
  create: {
    alias: 'c',
    description: 'create a project',
    examples: ['web-cli create <project-name>'],
  },
  config: {
    alias: 'conf',
    description: 'config project variable',
    examples: ['web-cli config set <key> <value>'],
  },
  clear: {
    alias: 'cl',
    description: 'clear the local project template',
    examples: ['web-cli clear'],
  },
  '*': {
    alias: '',
    description: 'command not found',
    examples: [],
  },
}

const plugins = [
  {
    name: 'lodash',
    value: 'lodash',
    checked: false,
  },
  {
    name: 'echarts',
    value: 'echarts',
    checked: false,
  },
  {
    name: 'dayjs',
    value: 'dayjs',
    checked: false,
  },
  {
    name: 'moment',
    value: 'moment',
    checked: false,
  },
  {
    name: 'eslint',
    value: 'eslint',
    checked: false,
  },
  {
    name: 'husky',
    value: 'husky',
    checked: false,
  },
  {
    name: 'sass',
    value: 'sass',
    checked: false,
  },
  {
    name: 'less',
    value: 'less',
    checked: false,
  },
]

const githuburl = (name, repo = '') => {
  switch (name) {
    case 'templates':
      return 'https://github.com/shine-templates'
    case 'repos':
      return 'https://api.github.com/orgs/shine-templates/repos'
    case 'branches':
      return `https://api.github.com/repos/shine-templates/${repo}/branches`
    default:
      return
  }
}

module.exports = {
  version,
  templatesDir,
  actions,
  githuburl,
  plugins,
}
