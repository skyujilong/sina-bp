"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 构建对象
 */
var BuildInfo = /** @class */ (function () {
    /**
     *
     * @param name 项目名字
     * @param git git项目地址 可以为空
     * @param bpConf 配置信息
     */
    function BuildInfo(name, git, bpConf) {
        this.name = name;
        this.git = git;
        this.bpConf = bpConf;
    }
    return BuildInfo;
}());
exports.default = BuildInfo;
