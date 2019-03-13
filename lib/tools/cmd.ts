import { spawn } from 'child_process';

function cmd(cmdTxt: string, args: string[]): Promise<undefined|null> {
    let args1 = Array.prototype.slice.call(arguments);
    return new Promise((resolve, reject) => {
        const cmd1 = spawn.apply(null, args1);
        cmd1.stdout.pipe(process.stdout);
        cmd1.stderr.on('data', (data) => {
            reject(new Error(data));
        });
        cmd1.on('close', () => {
            resolve();
        });
    });
}

export default cmd;