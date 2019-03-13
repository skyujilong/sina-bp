"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
function cmd(cmdTxt, args) {
    var args1 = Array.prototype.slice.call(arguments);
    return new Promise(function (resolve, reject) {
        var cmd1 = child_process_1.spawn.apply(null, args1);
        cmd1.stdout.pipe(process.stdout);
        cmd1.stderr.on('data', function (data) {
            reject(new Error(data));
        });
        cmd1.on('close', function () {
            resolve();
        });
    });
}
exports.default = cmd;
