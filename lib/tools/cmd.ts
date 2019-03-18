import { spawn } from 'child_process';

interface Options{
    cwd:string
}

async function cmd(cmdTxt: string, args: string[], opt?: Options ): Promise<undefined|null> {
    return new Promise((resolve, reject) => {
        const cmd = spawn(cmdTxt, args, opt);
        cmd.stdout.pipe(process.stdout);
        cmd.stderr.pipe(process.stderr);
        cmd.on('close', () => {
            resolve();
        });
    });
}

export default cmd;