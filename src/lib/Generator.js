const fs = require('fs')
const path = require('path')
const ncp = require('ncp')
const MetalSmith = require('metalsmith')
const inquirer = require('inquirer')
const _ = require('lodash')

class Generator {
  constructor(templateDir, projectDir) {
    this.templateDir = templateDir
    this.projectDir = projectDir
    this.repoUrl = ''
  }

  async parseTemplate() {
    if (!this.templateExists()) {
      await this.copyTemplate()
    } else {
      await this.renderTemplate()
    }
    return this.repoUrl
  }

  templateExists() {
    return fs.existsSync(path.join(this.templateDir, 'config.json'))
  }

  async copyTemplate() {
    ncp(this.templateDir, this.projectDir)
  }

  async promptConfig() {
    const configPath = path.join(this.templateDir, 'config.json')
    const args = require(configPath)
    return await inquirer.prompt([
      ...args,
      { type: 'input', name: 'repoUrl', message: '请输入Git仓库地址：' },
    ])
  }

  async renderJsonFile(file, obj) {
    let content = file.contents.toString()
    if (content.includes('<%=')) {
      const render = _.template(content)
      const result = render({ ...obj, name: this.projectDir })
      file.contents = Buffer.from(result)
    }
  }

  async renderTemplate() {
    try {
      const metal = MetalSmith(__dirname)
        .source(this.templateDir)
        .destination(path.resolve(this.projectDir))

      const meta = await this.promptConfig()
      this.repoUrl = meta.repoUrl
      metal.metadata(meta)

      metal.use(async (files) => {
        delete files['config.json']
        Reflect.ownKeys(files).forEach(async (file) => {
          if (file.includes('json')) {
            await this.renderJsonFile(files[file], meta)
          }
        })
      })

      await metal.build()
    } catch (err) {
      throw err
    }
  }
}

module.exports = async function (templateDir, projectDir) {
  const generator = new Generator(templateDir, projectDir)
  const repoUrl = await generator.parseTemplate()

  return repoUrl
}
