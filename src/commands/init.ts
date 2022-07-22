import path from 'path'
import inquirer from 'inquirer'
import {
  chalk,
  cwd,
  execa,
  failSpinner,
  fs,
  info,
  startSpinner,
  succeedSpiner,
  warn,
} from '../lib/index'

// 检查是否已经存在相同名字工程
const checkProjectExist = async (targetDir) => {
  if (fs.existsSync(targetDir)) {
    const answer = await inquirer.prompt({
      type: 'list',
      name: 'checkExist',
      message: `\n仓库路径${targetDir}已存在，请选择`,
      choices: ['覆盖', '取消'],
    })
    if (answer.checkExist === '覆盖') {
      warn(`删除${targetDir}ing...`)
      fs.removeSync(targetDir)
    }
    else {
      return true
    }
  }
  return false
}
let _templates = [] as ITemplate[]
const getQuestions = async (projectName = 'my-new-app') => {
  // @ts-expect-error
  const templates = await import('../template_src.json') as ITemplate[]
  _templates = templates
  return await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: `package name: (${projectName})`,
      default: projectName,
    },
    {
      type: 'list',
      name: 'projectType',
      message: '请选择项目模版',
      choices: templates.map(i => i.name),
      data: templates.map(i => i.degit),
    },
  ])
}

const cloneProject = async (targetDir, projectName, projectInfo) => {
  startSpinner(`正在创建项目 ${chalk.cyan(targetDir)}`)
  const degitUrl = _templates.find(i => i.name === projectInfo.projectType)?.degit ?? 'none'
  await execa('npx', ['degit', degitUrl, projectName])

  succeedSpiner(
    `项目创建完成 ${chalk.yellow(projectName)}\n👉 输入以下命令开始使用:`,
  )

  info('$ ni or pnpm install\n')
}

const action = async (projectName: string, cmdArgs?: any) => {
  try {
    // 获取项目路径
    const targetDir = path.join(
      (cmdArgs && cmdArgs.context) || cwd,
      projectName,
    )
    if (await checkProjectExist(targetDir))
      return

    const projectInfo = await getQuestions(projectName)
    console.log(projectInfo)
    await cloneProject(targetDir, projectName, projectInfo)
  }
  catch (err) {
    const e = err as Error
    failSpinner(e.message)
  }
}

export default {
  command: 'init <project-name>',
  description: '创建一个项目',
  optionList: [['--context <context>', '上下文路径']],
  action,
} as ICommand
