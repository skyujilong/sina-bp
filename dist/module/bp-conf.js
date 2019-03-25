"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 配置对象
 */
class BpConf {
    constructor(workspace, devHost, prodHost, prodImgHost, tinyPngKeys) {
        this.workspace = workspace;
        this.devHost = devHost;
        this.prodHost = prodHost;
        this.prodImgHost = prodImgHost;
        this.tinyPngKeys = tinyPngKeys;
    }
}
exports.default = BpConf;
