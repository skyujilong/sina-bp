'use strict';
const path = require('path');
let config = require('../config.js');

function spriteAlias() {
    let spritesList = config.sprites;
    let scssPath = path.resolve(__dirname, '..', 'pages', 'scss');
    let imgPath = path.resolve(__dirname, '..', 'pages', 'img');
    let alias = {};
    spritesList.forEach((item) => {
        alias[`${item.name}-sprite`] = path.join(scssPath, `${item.name}-sprite.scss`);
        alias[item.name] = path.join(imgPath, `${item.name}-sprite.png`);
    });
    return alias;
}

module.exports = {
    resolve: {
        extensions: ['.ts', '.js', '.json', '.css', '.jpeg', '.png', '.jpg', '.tpl'],
        //modules模块下加入 扫描的文件夹
        // modules: ['scss', 'node_modules'],
        alias: Object.assign({/**
         * 自定义的别名在这里写
         */}, spriteAlias())
    }
}