/**
 * Created by sina on 2016/6/27.
 */
"use strict";
const fs = require('fs');
const path = require('path');
const dirConfig = require('./lib/dir.config.js');
const fileConfg = require('./lib/file.config.js');
const dirBuild = require('./lib/path_test.js');
const svnInit = require('./lib/svn_init');
let _ = require('lodash');
const svnConfig = require('./lib/svn_config');
let argv = require('optimist').default({
    'homeDir': process.cwd()
}).argv;

const dirHandler = require('./lib/initDir');

//上线svn路径
const onlinePath = svnConfig.svnBaseUrl+svnConfig.iteamName+'/assets/';
// 标签svn路径
const tagPath = svnConfig.tagUrl;
//标签名称
const tagName = 'items_'+svnConfig.year+'_'+svnConfig.iteamName+'_release';
// 新增目录
const addDir = 'news/items/'+svnConfig.year+'/'+svnConfig.iteamName+'/';
const basePath = path.join(argv.homeDir, svnConfig.iteamName);



//添加基础文件
function addFile() {
    let dir = path.resolve(__dirname, './config');
    _.forEach(fileConfg, function(val, key) {
        fs.readFile(path.join(dir, key), 'utf-8', (err, data) => {
            if (err) {
                throw err;
            }
            if(key === 'qb.html'){
                typeof data;


             data=data.replace('onlineSvnPathStr', onlinePath);
             data=data.replace('tagPathStr', tagPath)
             data=data.replace('tagNameStr', tagName)
             data=data.replace('addPathStr', addDir)

            }
            fs.writeFile(path.resolve(basePath, val, key), data, (err) => {
                if (err) {
                    throw err;
                }
            });
        });
    });
}


// svnInit.init(function(){
//
//        //建立基本文件夹
//     //    dirBuild(basePath,function(){
//     //        addFile();
//     //    });
// });

// dirHandler('../demo/test');

//process.argv 返回cmd上的参数

//通过process.env获取全局环境变量
//TODO 根据全局变量进行设置相关公司的参数
console.log(process.env.SINA_PUBLIC_PATH);
