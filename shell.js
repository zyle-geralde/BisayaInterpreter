const readline = require("readline");
const basic = require("./Bisaya++copy.js"); 

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function startRepl() {
    rl.question("Bisaya++copy > ", (text) => {
        let [result, error] = basic.run('<stdin>',text);

        if (error) console.log(error.as_string());
        else console.log(result);

        startRepl();
    });
}

startRepl();