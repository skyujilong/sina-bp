'use strict';
const path = require('path');
const config = require('../config.js');
//雪碧图生成的快捷路径
let spriteAlias = (() => {
    let obj = {};
    config.sprites.forEach((item) => {
        obj[item.name] = path.join(__dirname, '..', 'pages', 'img', item.name + '-sprite.png')
    });
    return obj;
})();
module.exports = {
    module: {
        noParse: /jquery|lodash|zepto/
    },
    resolve: {
        modules: ["node_modules"],
        extensions: ['.js', '.json', '.css', '.jpeg', '.png', '.jpg', '.tpl'],
        alias: spriteAlias,
    },
    context: path.resolve(__dirname, '..'),
    target: 'web'
};
