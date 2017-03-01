'use strict';
const svnUltimate = require('node-svn-ultimate');
const _ = require('lodash');
const path = require('path');
// const svnConfig = require('./svn_config');

module.exports = {

    init: function(pathDir, svnConfig, fn) {

        let cwd = process.cwd(),
            absPath;
        if (path.isAbsolute(pathDir)) {
            absPath = pathDir;
        } else {
            absPath = path.resolve(cwd, pathDir);
        }

        //创建svn 根目录
        svnUltimate.commands.mkdir(svnConfig.svn, {
            params: [
                '-m "init ' + svnConfig.tagName + ' "'
            ]
        }, function(err) {
            if(err){
                throw err;
            }
            //checkout项目，然后在项目中构建目录
            svnUltimate.commands.checkout(svnConfig.svn,absPath, function(err){
                if(err){
                    throw err;
                }
                //TODO 创建文件夹
                fn(absPath);
            });

            //TODO 创建相关tag目录以及qb目录



        });
    }
}
