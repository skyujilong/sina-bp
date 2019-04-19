"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 配置对象
 */
class BpConf {
    constructor(workspace, devHost, prodHost, prodImgHost, tinyPngKeys, qbDir) {
        this.workspace = workspace;
        this.devHost = devHost;
        this.prodHost = prodHost;
        this.prodImgHost = prodImgHost || prodHost;
        this.tinyPngKeys = tinyPngKeys;
        if (qbDir) {
            this.qbDir = qbDir;
        }
    }
}
exports.default = BpConf;
