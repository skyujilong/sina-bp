/**
 * Created by sina on 2016/6/27.
 */
"use strict";
const fs = require('fs');
const path = require('path');
const dirConfig = require('../dir.config.js');
const fileConfg = require('../file.config.js');
let argv = require('optimist').default({
    'homeDir':process.cwd(),
    'dirName':''
}).argv;

//TODO test
argv.dirName = 'testYjl';

let _ = require('lodash');
const basePath = path.join(argv.homeDir,argv.dirName);
if(argv.dirName === ''){
    throw new Error('need dirName,eg: -dirName test');
}else{
    //建立基本文件夹
    fs.mkdirSync(basePath);
}

function bulid(currentDir,list){
    _.forEach(list,function(value){
        fs.mkdirSync(path.join(currentDir,value.dirName));
        bulid(path.join(currentDir,value.dirName),value.subDir);
    });
}
//TODO 添加基础文件
function addFile(){
    let dir = path.resolve(__dirname,'../config');
    _.forEach(fileConfg,function(val,key){
        fs.readFile(path.join(dir,key),'utf-8',(err,data)=>{
            if(err){
                throw err;
            }
            isMakeDir(path.resolve(basePath,val),()=>{
                fs.writeFile(path.resolve(basePath,val,key),data,(err)=>{
                    if(err){
                        throw err;
                    }
                });
            });
        });
    });
}
function isMakeDir(path,callback){
    fs.stat(path,(err,stats)=>{
        if(err == null){
            callback();
        }else if(err.code == 'ENOENT'){
            //建立文件夹
            fs.mkdir(path,(err)=>{
                if(err){
                    throw new err;
                }
                callback();
            });
        }else{
            throw err;
        }
    })
}
bulid(basePath,dirConfig.subDir);
addFile();