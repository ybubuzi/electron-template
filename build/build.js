const execSync = require('child_process').execSync;
const fs = require('fs');

const getGitVersion = async (envObj) => {
    const buffer = execSync(`git rev-parse HEAD`);
    const rawText = fs.readFileSync('build/.env', 'utf8');
    envObj.RENDERER_COMMIT_VER = buffer.toString()
}



function dateFormat(date) {
    function showTime(t) {
        var time
        time = t >= 10 ? t : '0' + t
        return time
    }
    var year = date.getFullYear();                // 年
    var month = showTime(date.getMonth() + 1);        // 月
    var week = showTime(date.getDay());           // 星期
    var day = showTime(date.getDate());          // 日
    var hours = showTime(date.getHours());         // 小时
    var minutes = showTime(date.getMinutes());    // 分钟
    var second = showTime(date.getSeconds());     // 秒
    var str = '';
    str = str + year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + second
    return str
}
const getBuildDate = async (envObj) => {
    envObj.RENDERER_BUILD_DATE = dateFormat(new Date())
}

const parseEnv = (path) => {
    const rawText = fs.readFileSync(path, 'utf8');
    const lines = rawText.split(/\r?\n/);
    const envObj = {}
    lines.forEach((line, index) => {
        const match = line.match(/^(\w+)=(.*)/)
        if (match) {
            envObj[match[1]] = match[2]
        }
    })
    return envObj
}
const writeEnv = (path, envObj) => {
    const lines = []
    Object.keys(envObj).forEach(key => {
        const val = envObj[key].replace('\n', '')
        lines.push(`${key}=${val}`)
    })
    console.log(`write build env:`)
    console.log(lines)
    fs.writeFileSync(path, lines.filter(item => item !== '').join('\n'), 'utf8')
}
const main = async () => {
    const exists = fs.existsSync('build/.env')
    if(!exists){
        fs.openSync('build/.env', 'a')
    }
    const envObj = parseEnv('build/.env')
    const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    envObj.RENDERER_VERSION = packageObj.version
    await getGitVersion(envObj)
    await getBuildDate(envObj)
    writeEnv('build/.env', envObj)
}
main()