"use strict";
// 主线逻辑
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_1 = require("yargs");
var packageJson = require("./../package.json");
var answer_line_1 = require("./tools/answer-line");
var utils_1 = require("./tools/utils");
var bp_conf_1 = require("./module/bp-conf");
var buid_info_1 = require("./module/buid-info");
var fs_1 = require("./tools/fs");
var argv = yargs_1.help().alias('help', 'h').version().alias('version', 'v').usage([
    '项目地址与说明：https://github.com/skyujilong/sina-bp',
    '版本：' + packageJson.version,
    '用法:',
    '1、配置文件方案: sina-bp -c [你配置文件的地址] -n [你要生成的项目名字]',
    '2、非配置文件方案: sina-bp -d [你要生成项目的地址]'
].join('\n')).options({
    dir: {
        alias: 'd',
        describe: '生成项目的路径',
        type: 'string'
    },
    conf: {
        alias: 'c',
        describe: '配置文件地址',
        type: 'string'
    },
    name: {
        alias: 'n',
        describe: '项目名称',
        type: 'string'
    },
    devHost: {
        describe: '测试环境绑定Host',
        type: 'string',
        default: 'http://test.sina.com.cn/'
    }
}).argv;
function getConf() {
    return __awaiter(this, void 0, void 0, function () {
        var isCompany, bpConf, confDir, git, isIllegalGitFlag;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, answer_line_1.answerLineOk('是否是公司项目(y/n):', ['y', 'n'])];
                case 1:
                    isCompany = _a.sent();
                    if (!(isCompany === 'y')) return [3 /*break*/, 3];
                    confDir = utils_1.transformDir(argv.conf);
                    return [4 /*yield*/, fs_1.readLine(confDir)];
                case 2:
                    bpConf = _a.sent();
                    _a.label = 3;
                case 3:
                    git = '';
                    isIllegalGitFlag = false;
                    _a.label = 4;
                case 4:
                    if (!true) return [3 /*break*/, 10];
                    if (!(isCompany === 'y' && utils_1.isIllegalGit(git))) return [3 /*break*/, 6];
                    return [4 /*yield*/, answer_line_1.default(isIllegalGitFlag ? '请输入合法的git地址（仅支持ssh）:' : 'git地址（仅支持ssh）:')];
                case 5:
                    git = _a.sent();
                    isIllegalGitFlag = true;
                    return [3 /*break*/, 9];
                case 6:
                    if (!(isCompany === 'n' && (git !== 'n' && utils_1.isIllegalGit(git)))) return [3 /*break*/, 8];
                    return [4 /*yield*/, answer_line_1.default(isIllegalGitFlag ? '请输入合法的git地址(仅支持ssh & 输入n为不添加git地址):' : 'git地址(仅支持ssh & 输入n为不添加git地址):')];
                case 7:
                    git = _a.sent();
                    isIllegalGitFlag = true;
                    return [3 /*break*/, 9];
                case 8:
                    if ((git === 'n' || isCompany === 'n')) {
                        git = '';
                        return [3 /*break*/, 10];
                    }
                    else if (!utils_1.isIllegalGit(git)) {
                        return [3 /*break*/, 10];
                    }
                    _a.label = 9;
                case 9: return [3 /*break*/, 4];
                case 10: return [2 /*return*/, new buid_info_1.default('', '', new bp_conf_1.default('', '', '', '', []))];
            }
        });
    });
}
function build(argvs) {
    return __awaiter(this, void 0, void 0, function () {
        var buildInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getConf()];
                case 1:
                    buildInfo = _a.sent();
                    return [2 /*return*/, '项目地址：/data1/wwww'];
            }
        });
    });
}
build(JSON.stringify(argv)).then(function (dir) {
    console.log(dir);
    console.log('done!!!');
});
