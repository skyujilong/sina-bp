const svnUltimate = require('node-svn-ultimate');
const svnConfig = require('./svn_config');

var svnBaseUrl = svnConfig.itemPath+svnConfig.year+'/';
var svnTagUrl = svnConfig.tagPath+svnConfig.year+'/';

module.exports = {
	
	init:function(fn){
		// 创建svn目录
		svnUltimate.commands.mkdir(svnBaseUrl+svnConfig.iteamName, {params: [ '-m "Commit'+svnConfig.iteamName+'comment"' ]}, function(){
			// 创建tag目录
			
		svnUltimate.commands.mkdir(svnTagUrl+svnConfig.iteamName, {params: [ '-m "Commit'+svnConfig.iteamName+'comment"' ]}, function(){
				svnUltimate.commands.mkdir(svnTagUrl+svnConfig.iteamName+'/qb', {params: [ '-m "Commit'+svnConfig.iteamName+'comment"' ]}, function(){
						fn();
					})
			})
		})
	}
}