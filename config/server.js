/**
 * Created by sina on 2016/5/24.
 */
/**
 * Created by sina on 2016/5/19.
 */
"use strict";
let WebpackDevServer = require("webpack-dev-server");
let webpack = require("webpack");
let argv = require('optimist').default({
    'p':8888,//默认端口号
    'a':'127.0.0.1'//默认的服务地址
}).argv;
let path = require('path');
let webpackConfig = require('../webpack.config.js')(true);
let transformEntry = require('./transform-entry.js');
webpackConfig.entry = transformEntry.transform(webpackConfig.entry,argv.a,argv.p);
webpackConfig.output.publicPath = 'http://' + argv.a + ':' + argv.p + '/assets/';
webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

let compiler = webpack(webpackConfig, function (err, stats) {
    if (err) {
        console.log(err);
    }
    console.log(stats.toString({colors: true}));
});

let server = new WebpackDevServer(compiler, {
    contentBase: path.resolve(__dirname,'..','assets'),
    inline: true,
    hot: true,
    historyApiFallback: false,
    compress: true,
    /*proxy: {
     "*": "http://localhost:9091"
     },*/

    // pass [static options](http://expressjs.com/en/4x/api.html#express.static) to inner express server
    staticOptions: {},
    // webpack-dev-middleware options
    quiet: false,
    noInfo: false,
    //lazy: true, 在不开启lazy的模式下 win7运行良好
    filename: "js/[name].js",
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    publicPath: "/assets/",
    headers: {"X-Custom-Header": "yes"},
    stats: {colors: true}
});
server.listen(argv.p, argv.a, function (err) {
    if(err){
        console.log(err);
    }
    console.log('the server is online %s:%s', argv.a, argv.p);
});
