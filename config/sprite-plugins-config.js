'use strict';
const path = require('path');
const fs = require('fs');
const SpritesmithPlugin = require('webpack-spritesmith');
const config = require('../config.js');
let spritePlugins = [];
config.sprites.forEach((item) => {
    let name = item.name.trim();
    let dir = path.resolve(__dirname, '..', 'pages','sprite', name);
    //如果没有这个文件夹就建立这个文件夹
    fs.stat(dir, (err) => {
        if(err){
            fs.mkdir(dir,()=>{
                console.log('generate dir' + name);
            });
        }
    });
    spritePlugins.push(new SpritesmithPlugin({
        src: {
            cwd: dir,
            glob: '*.*'
        },
        target: {
            image: path.resolve(__dirname, '..', 'pages/img/' + name + '-sprite.png'),
            css: path.resolve(__dirname, '..', 'pages/scss/' + name + '-sprite.scss')
        },
        apiOptions: {
            cssImageRef: '~' + name
        }
    }));
});
module.exports = spritePlugins;
