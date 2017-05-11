# build-sina-project
初始化新浪的项目

### 版本环境介绍 ###
1. 基于webpack2
1. 模板引擎更改为mustache

### 环境需要 ###
SVN命令行

### DEMO ###
 ```
 $ node index.js --dir '/d/yourProjectName' --svn 'https://yourProjectAdds/2017/' --devPubilcPath 'http://test.sina.com.cn' --onLinePublicPath 'http://test.sina.com.cn'
 ```
### 参数说明 ###
* dir: 本地目录，最后一个文件夹，作为项目的名字。可以是绝对路径也可以是相对路径，**必填**,**已文件名作为结尾不要以/结尾**。
* svn：svn地址（**非必填**），要求是年份作为url的截止，eg:

```
$ node index.js --dir '/d/workspace/demo2017' --svn 'https://svn.sina.com.cn/news/item/2017/'
//这样会在trunk下的2017目录下生成demo2017目录，以及在对应的tag目录下生成demo2017目录与qb目录。
```

* devPubilcPath：开发环境访问的地址，注意要绑定自己的host(**非必填**)。默认值：http://test.sina.com.cn
* onLinePublicPath：上线资源文件的地址(**非必填**)。默认值：http://test.sina.com.cn
