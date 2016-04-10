var repl = require("repl");

function eval(cmd, context, filename, callback) {
    console.log(filename + ": " + cmd);
    if (cmd.trim().indexOf(";") > -1) {
        callback(null, cmd);
    }
}

if (require.main === module) {
    repl.start({
        prompt: "dobro> ",
        input: process.stdin,
        output: process.stdout,
        eval: eval,
    });
}
