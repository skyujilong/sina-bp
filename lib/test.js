'use strict';
import "@babel/polyfill";

const { spawn } = require('child_process');

const readline = require('readline');

function cmd(){
    let args = Array.prototype.slice.call(arguments);
    return new Promise((resolve, reject) => {
        const cmd1 = spawn.apply(null,args);
        cmd1.stdout.pipe(process.stdout);
        cmd1.stderr.on('data', (data)=>{
            reject(new Error(data));
        });

        cmd1.on('close',()=>{
            resolve(cmd1);
        })
    }); 
}

async function runCmd(){
    await cmd('ls', ['-al', './']);
    // await cmd('ping', ['127.0.0.1']);
    let result = await answerLine('你感觉如何？\n');
    console.log(result);
}

runCmd().then(()=>{
    console.log('all done!!!!');
},()=>{
    console.log('error!!!');
});

// const readline = require('readline');

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// rl.question('你认为 Node.js 中文网怎么样？', (answer) => {
//     // 对答案进行处理
//     console.log(`多谢你的反馈：${answer}`);

//     rl.close();
// });


function answerLine(question){
    return new Promise((resolve,reject)=>{
        const rl = readline.createInterface({
            input:process.stdin,
            output:process.stdout
        })
        rl.question(question,(answer)=>{
            rl.close();
            resolve(answer);
        })
    });
}

