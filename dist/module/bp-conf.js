"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 配置对象
 */
class BpConf {
    constructor(workspace, devHost, prodPath, prodImgPath, tinyPngKeys) {
        this.workspace = workspace;
        this.devHost = devHost;
        this.prodPath = prodPath;
        this.prodImgPath = prodImgPath;
        this.tinyPngKeys = tinyPngKeys;
    }
}
exports.default = BpConf;
