'use strict';
import "@babel/polyfill";
// const argv = require('yargs')
// .help()
// .alias('help','h')
// .version()
// .alias('version','v')
// .option('width',{
//     alias:'w',
//     describe:'宽度',
//     type:'string'
// })
// .demandOption(['width'],'please provide with arguments')
// .usage('usage: $0 -w [num] -s [num]')
// .argv;

// console.log(argv);



// const { spawn } = require('child_process');
// const ps = spawn('ping', ['127.0.0.1']);
// // const ps = spawn('ps', ['ax']);
// // const grep = spawn('grep', ['ssh']);

// ps.stdout.on('data', (data) => {
//     console.log(data.toString());
//     // grep.stdin.write(data);
// });

// ps.stderr.on('data', (data) => {
//     console.log(`ps stderr: ${data}`);
// });

// ps.on('close', (code) => {
//     if (code !== 0) {
//         console.log(`ps 进程退出码：${code}`);
//     }
//     // grep.stdin.end();
// });

// grep.stdout.on('data', (data) => {
//     console.log(data.toString());
// });

// grep.stderr.on('data', (data) => {
//     console.log(`grep stderr: ${data}`);
// });

// grep.on('close', (code) => {
//     if (code !== 0) {
//         console.log(`grep 进程退出码：${code}`);
//     }
// });


const { spawn } = require('child_process');

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


// cmd('ls',['-al','./']).then((spawnObj)=>{
//     console.log('done!!!');
//     // console.log(spawnObj);
// },(e)=>{
//     console.log(e);
// });
// 6.0的版本不支持

async function runCmd(){
    let spawnObj = await cmd('ls', ['-al', './']);
    // console.log(spawnObj);
    // // await cmd()
    // console.log(spawnObj);
}


runCmd().then(()=>{
    console.log('all done!');
},()=>{
    console.log('error!!!');
})



