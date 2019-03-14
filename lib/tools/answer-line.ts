import {
    createInterface
} from 'readline';

function answerLine(question: string): Promise < string > {
    return new Promise((resolve, reject) => {
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout
        })
        rl.question(question, (answer: string) => {
            rl.close();
            resolve(answer);
        })
    });
}

async function answerLineOk(questions: string, answerList: string[]): Promise < string > {
    while (true) {
        let answer = await answerLine(questions);
        for (let item of answerList) {
            if (item.toLocaleLowerCase() === answer.toLocaleLowerCase()) {
                return answer.toLocaleLowerCase();
                break;
            }
        }
    }
}


export default answerLine;

export {
    answerLineOk
};