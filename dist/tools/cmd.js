"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
function cmd(cmdTxt, args, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            try {
                const cmd = child_process_1.spawn(cmdTxt, args, opt);
                cmd.stdout.pipe(process.stdout);
                cmd.stderr.pipe(process.stderr);
                cmd.on('close', () => {
                    resolve();
                });
            }
            catch (e) {
                reject(e);
            }
        });
    });
}
exports.default = cmd;
