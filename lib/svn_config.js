module.exports={
	itemPath:'xxxx',//项目svn路径
	tagPath:'xxx',//版本svn文件
	year:2017,
	svnBaseUrl:function(){
		return this.itemPath+this.year+'/';
	},
	iteamName:'test2017020804',
	tagUrl:function(){
		return this.tagPath+this.year+'/';
	}
}