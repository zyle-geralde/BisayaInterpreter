const readline = require("readline");
const basic = require("./Bisaya++.js"); 

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function startRepl() {
    rl.question("Bisaya++ > ", (text) => {
        let [result, error] = basic.run(text);

        if (error) console.log(error.as_string());
        else console.log(result);

        startRepl();
    });
}

startRepl();