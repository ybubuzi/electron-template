//https://www.electron.build/configuration/configuration#afterpack
exports.default = async function (context) {   //console.log(context)
    var fs = require('fs');
    var localeDir = context.appOutDir + '/locales/';
    const platform = process.platform;
    if (platform != 'win32') {
        return
    }
    if (!fs.existsSync(localeDir)) {
        return
    }
    var files = fs.readdirSync(localeDir);
    const needPak = [`zh-CN.pak`, `en-US.pak`]
    files.forEach(function (file) {
        if (!(files && files.length)) return
        if (!needPak.includes(file)) {
            fs.unlinkSync(localeDir + file)
        }
    })
    fs.unlinkSync(context.appOutDir + '/LICENSE.electron.txt')
    fs.unlinkSync(context.appOutDir + '/LICENSES.chromium.html')
} 
