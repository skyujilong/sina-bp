# sina-bp
sina构建活动页项目脚手架

### 版本环境介绍 ###
1. 基于webpack2
1. 模板引擎更改为mustache

### 安装 ###
```
$ npm install sina-bp -g
```

### 用例 ###
```
//读取配置文件方式
sina-bp --conf /d/conf/blog-build.conf --name helloworld
//直接根据参数生成
sina-bp --dir /d/workspace --name helloworld --devHost http://test.sina.com.cn --onLineHost http://test.sina.com.cn
```

### 参数说明 ###
1. **conf**:配置文件地址，相对路径与绝对路径均可。
2. **name**:项目名称。
3. **dir**:在conf存在的情况下，无效，项目生成目录地址。
4. **devHost**:测试环境下的host地址
5. **onLineHost**:资源文件线上地址
6. **onLineImgHost**:图片类型资源文件线上地址，如果不填默认和onLineHost地址一致

### config文件说明 ###
```js
{
    name:'projectName',//可以为空
    workspace:'/d/playground/',//在该路径下创建对应的文件夹
    svn:'https://svn.intra.sina.com.cn/blog/trunk/ria/items/2017/',//在该svn下创建项目，可空，目前仅接受已年份结尾的svn地址
    devHost:'http://test.sina.com.cn',//开发域名
    onLineHost:'http://mjs.sinajs.cn',//资源域名
    onLineImgHost:'http://img.mjs.sinajs.cn/',//图片单独域名可空
    qbNewDir:'blog/items/'//qb相关新增路径，该字段选填，要是没有，不生成qb.html文件
}
```
