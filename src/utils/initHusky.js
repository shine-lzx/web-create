const path = require('path')
const fs = require('fs')

// 1.如果用户安装了husky，则在项目根目录下生成.huskyrc文件夹，并写入husky的配置
// 2.给生成的项目中的package.json文件添加husky的配置

module.exports = async (plugins, projectDir) => {
  if (plugins.includes('husky')) {
    const projectPath = path.join(process.cwd(), projectDir)
    if (fs.existsSync(projectPath)) {
      process.chdir(projectPath)
      console.log('projectPath: ', projectPath)
    }
  }
}
