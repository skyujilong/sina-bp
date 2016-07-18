/**
 * Created by sina on 2016/5/24.
 */
"use strict";
function transform(entry, addr, port) {
    if (!entry) {
        throw new Error('entry is empty');
    }
    //排除vender
    for (let key in entry) {
        if (key === 'vender') {
            continue;
        }
        let value = entry[key];
        if (Object.prototype.toString.call(value) === '[object Array]') {
            entry[key].splice(0, 0, 'webpack-dev-server/client?http://' + addr + ':' + port,
                'webpack/hot/dev-server');
        } else {
            entry[key] = ['webpack-dev-server/client?http://' + addr + ':' + port,
                'webpack/hot/dev-server', value];
        }
    }
    return entry;
}


module.exports = {
    transform: function (entry, addr, port) {
        return transform(entry, addr, port);
    }
};