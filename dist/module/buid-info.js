"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 构建对象
 */
class BuildInfo {
    /**
     *
     * @param name 项目名字
     * @param git git项目地址 可以为空
     * @param bpConf 配置信息
     */
    constructor(name, git, isCompanyProject, bpConf) {
        this.name = name;
        this.git = git;
        this.bpConf = bpConf;
        this.isCompanyProject = isCompanyProject;
        if (this.isCompanyProject) {
            this.onlineQb = `blog/item/${new Date().getFullYear()}/`;
        }
    }
    setIsCompanyProject(isCompanyProject) {
        this.isCompanyProject = isCompanyProject;
    }
}
exports.default = BuildInfo;
