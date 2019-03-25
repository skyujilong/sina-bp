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
const readline_1 = require("readline");
function answerLine(question) {
    return new Promise((resolve, reject) => {
        const rl = readline_1.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}
function answerLineOk(questions, answerList) {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            let answer = yield answerLine(questions);
            for (let item of answerList) {
                if (item.toLocaleLowerCase() === answer.toLocaleLowerCase()) {
                    return answer.toLocaleLowerCase();
                    break;
                }
            }
        }
    });
}
exports.answerLineOk = answerLineOk;
exports.default = answerLine;
