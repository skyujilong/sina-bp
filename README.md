# build-sina-project
初始化新浪的项目
### eg：###
 node index.js --homeDir '/d'
### 参数说明 ###
1. homeDir: 生成项目父级目录需要传入相对路径

### 配置文件 ###
src/svn_config.js

    module.exports={
    	year:2017, //设置年份
    	svnBaseUrl:function(){ //设置项目文件svn路径
    		return 'https://svn1.intra.sina.com.cn/sinanews/trunk/ria/items/'+this.year+'/';
    	},
    	iteamName:'test2017020707', //设置项目名
    	tagUrl:function(){ //设置版本库svn路径
    		return 'https://svn1.intra.sina.com.cn/sinanews/tags/ria/items/'+this.year+'/';
    	}
    }
