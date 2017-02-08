const svnUltimate = require('node-svn-ultimate');
const svnConfig = require('./svn_config');

module.exports = {
	
	init:function(fn){
		// 创建svn目录
		svnUltimate.commands.mkdir(svnConfig.svnBaseUrl()+svnConfig.iteamName, {params: [ '-m "Commit'+svnConfig.iteamName+'comment"' ]}, function(){
			// 创建tag目录
			
		svnUltimate.commands.mkdir(svnConfig.tagUrl()+svnConfig.iteamName, {params: [ '-m "Commit'+svnConfig.iteamName+'comment"' ]}, function(){
				svnUltimate.commands.mkdir(svnConfig.tagUrl()+svnConfig.iteamName+'/qb', {params: [ '-m "Commit'+svnConfig.iteamName+'comment"' ]}, function(){
						fn();
					})
			})
		})
	}
}