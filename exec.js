// 使用exec 调用系统命令
// 以git上传为例
const util = require('util')
const exec = util.promisify(require('child_process').exec)
async function upload(cmdStr) {
    const { stdout, stderr } = await exec(cmdStr)
    console.log('stdout:', stdout)
    console.log('stderr:', stderr)
}
upload('git add ./ &&  git commit -m "update:app调试" && git push')