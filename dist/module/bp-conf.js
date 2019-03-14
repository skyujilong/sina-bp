"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 配置对象
 */
var BpConf = /** @class */ (function () {
    function BpConf(workspace, devHost, prodHost, prodImgHost, tinyPngKeys) {
        this.workspace = workspace;
        this.devHost = devHost;
        this.prodHost = prodHost;
        this.prodImgHost = prodImgHost;
        this.tinyPngKeys = tinyPngKeys;
    }
    return BpConf;
}());
exports.default = BpConf;
