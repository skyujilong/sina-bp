# 安装
### 安装nodejs LTS版本
[地址](http://nodejs.org/)

### 安装cnpm
```
$ npm install cnpm -g --registry=https://registry.npm.taobao.org
```
### 安装依赖模块
```
$ cnpm install
$ cnpm install cross-env -g
$ cnpm install http-server -g
$ cnpm install webpack-dev-server -g
$ cnpm install webpack@1.13.0 -g
```
# 运行命令
### 开发环境（非IE）
```
$ npm run dev-build
```
### 开发环境（测试ie[低版本]）
```
$ npm run dev-ie-build
$ npm run dev-ie-server
```
### 打包上线
```
$ npm run build
```
# 配置项说明
```javascript
    //在根目录下的config.js是，简单的配置文件
    {
        publicPath: 'http://test.sina.com.cn', //已http或者https开头的绝对地址
        onLinePublicPath: 'http://simg.sinajs.cn/products/news/items/2016/', //线上静态资源地址
        md5: false, //hash 可选值 false：不加md5值 hash：全部资源公用一个hash chunkhash：单文件一个hash值
        //雪碧图的配资
        sprites: [{
            //生成雪碧图的文件名字，该文件夹在pages下生成，eg: pages/sprite/normal,
            //有必要的话可以生成多个雪碧图的文件夹,后续生成scss的雪碧图映射文件与name
            //是一致的，同时也会在 img文件夹下面生成对应名字的png文件
            name: 'normal'
        }]
    }
    //注意雪碧图目前配置仅仅支持pc端的，后续会添加移动端的支持
```
# 项目开发目录简单说明
1. pages/html目录下是开发页面的html构建，不需要引入业务文件
2. pages/js/page目录下是开发js的主入口文件，注意这个js文件夹下的js文件需要与上面1中的html目录中的html同名，否则无法给对应的html注入对应的js文件
3. pages/sprite/** 文件夹中的图片是都是要生成雪碧图的


# change log
* tagv0.6 修复package.json文件中的运行命令行的一个错误。
* tagv0.5 因为webpack-dashboard对于git bash模拟器支持不够友好，因此放弃对他的应用。将tinypng的key值转移到config.js进行管理。修复config.js中md5参数不为false的时候，测试环境运行命令会产生错误的问题。
* tagv0.4 修改命令英文拼写错误
* tagv0.3 增加README.MD的简要说明
* tagv0.2 增加PC雪碧图的支持，增加简单的配置支持。
* tagv0.1 优化原有开发环境代码，采用内存的方式开发代码，添加跨浏览器环境运行命令。
