'use strict';
//项目配置
module.exports = {
    publicPath: '{{publicPath}}', //已http或者https开头的绝对地址
    onLinePublicPath: '{{onlinePath}}', //线上静态资源地址
    onLineImgPublicPath:'{{onlineImgPath}}',//线上img的资源地址
    md5: true, // 线上环境是否md5版本化， 默认是true，不启用可以用false
    //雪碧图的配资
    sprites: [{
        //生成雪碧图的文件名字，该文件夹在pages下生成，eg: pages/sprite/normal,
        //有必要的话可以生成多个雪碧图的文件夹,后续生成scss的雪碧图映射文件与name
        //是一致的，同时也会在 img文件夹下面生成对应名字的png文件
        name: 'normal'
    }],
    //tinyPngKeys 申请地址：https://tinypng.com/developers
    tinyPngKeys: '{{tinyPngKeys}}'
}
