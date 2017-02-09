# build-sina-project
初始化新浪的项目
### eg：###
 node index.js --homeDir '/d'
### 参数说明 ###
1. homeDir: 生成项目父级目录需要传入相对路径

### 配置文件 ###
lib/svn_config.js

    module.exports={
    	itemPath:'iteam_svn_path',//项目svn父级路径
		tagPath:'tag_svn_path',//版本库svn路径
		year:2017, //目录年份
		iteamName:'test2017020907', //项目目录名
    }
