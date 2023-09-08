# 运行
1. `npm install`
2. `npm run dev`
# 语义化代码提交规则
* `feat`: feature, 新增功能
* `fix` : bug fix, 修复 bug
* `docs`: documentation, 仅仅修改了文档，如 README.md
* `style`: style, 仅仅是对格式进行修改，如逗号、缩进、空格等，不改变代码逻辑
* `refactor`: refactor, 代码重构，一般更改了源文件或测试文件，但没有新增功能或修复 bug
* `perf`: preformance, 优化相关，如提升性能、用户体验等
* `test`: test, 测试用例，包括单元测试，集成测试
* `ci`:ci, 代码持续集成
* `chore`: chore, 对于库的其他内容的改变，一般不涉及到源文件或测试文件，比如更改 CI 设置，提升仓库以来等
* `revert`: 版本回滚

# 项目结构
```shell
|-- README.md                       # 项目说明文件
|-- build                           # 项目构建变量相关文件
|   |-- build.js                    # 构建预执行脚本
|   |-- entitlements.mac.plist  
|   |-- icon.icns                   
|   |-- icon.ico                    # 程序图标ico格式
|   |-- icon.png                    # 程序图标png格式
|   `-- notarize.js                 # mac签名文件
|-- devtool                         # vue开发者工具
|-- electron-builder.yml            # electron打包配置
|-- electron.vite.config.ts         # electron-vite运行入口脚本
|-- package.json                    # ...
|-- resources                       # 公用资源文件夹，此文件不会打包进程序，将以原始形式出现在安装后的目录
|-- src                             # 项目源代母
|   |-- common                      # 项目公用代码库，注意：此处代码必须保证在nodejs与web环境均能正确执行
|   |-- main                        # electron项目主进程相关源代码
|   |-- preload                     # electron预加载脚本，用于处理渲染进程与主进程的通信
|   `-- renderer                    # electron渲染进程源代码文件，可按传统前端页面开发即可
|-- tsconfig.json                   # 全局ts配置
|-- tsconfig.node.json              # main与preload的ts类型检查配置
`-- tsconfig.web.json               # renderer的ts类型检查配置
```