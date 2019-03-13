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
        this.isCompanyProject = false;
    }
    BpConf.prototype.setIsCompanyProject = function (isCompanyProject) {
        this.isCompanyProject = isCompanyProject;
    };
    return BpConf;
}());
exports.default = BpConf;
