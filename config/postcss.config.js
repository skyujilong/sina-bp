'use strict';
const autoprefixer = require('autoprefixer');
const postcssOpacity = require('postcss-opacity');
const colorRgbaFallback = require("postcss-color-rgba-fallback");
const postcssFixie = require('postcss-fixie');
const postcssWillChange = require('postcss-will-change');
const postcssFilterGradient = require('postcss-filter-gradient');
module.exports = {
    plugins:[
        /**
         * 动画优化方式，可以采用will-change属性
         * .foo {
         *    will-change: transform;
         *}
         *after------>
         * .foo {
         *    backface-visibility: hidden;
         *    will-change: transform;
         *}
         */
        postcssWillChange(),
        
        //将rgba转化成对应ie浏览器也能解析的filter
        colorRgbaFallback({
            oldie: true
        }),
        // 用于支持ie的hack语句
        postcssFixie(),

        // 用于支持background filter gradient,eg:
        // from:
        // background: linear-gradient(to bottom, #1e5799, #7db9e8);
        // to:
        // background: linear-gradient(to bottom, #1e5799, #7db9e8);
        // filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff1e5799', endColorstr='#ff7db9e8', GradientType=0);
        //TODO postcssFilterGradient 与 postcssOpacity 一起使用可能会有问题。可能有一个属性会显示不全
        postcssFilterGradient(),

        //为ie浏览器添加opactity filter
        postcssOpacity(),

        //自动添加前缀
        autoprefixer({
            browsers: [
                // 桌面级浏览器
                '>1%',
                'ie 6-11',
                'ff > 0',
                'Opera > 0',
                'Safari > 0',
                'Chrome > 0',
                // 移动级浏览器
                'UCAndroid > 0',
                'Samsung > 0',
                'Android > 0',
                'iOS > 0'
            ]
        })
    ]
};
