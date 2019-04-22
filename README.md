# sina-bp
sina构建活动页项目脚手架

## node版本需求
node>7.0.0

### 版本环境介绍 ###
1. 基于webpack4
1. 模板引擎更改为mustache
1. 支持es6 推荐采用es6的包引入规范，可以使用webpack的tree shaking来减少包的体积
1. 支持ts
1. 支持pc的雪碧图合成
1. 支持图片压缩

### 安装 ###
```
$ npm install sina-bp -g
```

### 用例 ###
```
//输出用法用例
sina-bp -h

//读取配置文件方式
sina-bp --conf /d/conf/blog-build.conf --name helloworld

//直接根据参数生成
sina-bp --dir /d/workspace 

//也可以直接运行sina-bp，根据提示进行补充属性。
sina-bp
```

### 参数说明 ###
1. **conf**:配置文件地址，相对路径与绝对路径均可。
2. **name**:项目名称。(在没有指定github项目的时候，生效)
3. **dir**:在conf存在的情况下，无效，项目生成目录地址。
4. **devHost**:测试环境下的host地址
5. **prodHost**:资源文件线上地址
6. **prodImgHost**:图片类型资源文件线上地址，如果不填默认和prodHost地址一致
7. **tinyPngKeys**: 图片压缩服务所需要的key值。数组类型，获取图片压缩服务的key值的地址：https://tinypng.com/developers 

### config文件说明 ###
```
# workspace 地址 （必填|暂时仅支持绝对路径）
workspace=/Users/jilong5/playground
# 测试host地址 （必填|需要在host文件中绑定该host。127.0.0.1 test.sina.cn）
devHost=test.sina.cn
# 线上域名地址 （必填）
prodHost=mjs.sinajs.cn
# 线上域名图片地址 （必填）
prodImgHost=img.mjs.sinajs.cn
# qb线上路径地址 （选填）
qbDir=blog/item/
# tinyPngKeys （必填）
tinyPngKeys=key1,key2,key3,ke4
```
