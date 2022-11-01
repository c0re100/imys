const {spawn} = require('child_process');

let debug = false;

function startMITM() {
    // Spawn Proxy
    const ls = spawn('./IMYSProxy', [debug ? '--addr=:5678' : '']);

    ls.stdout.on('data', (data) => {

    });

    ls.stderr.on('data', (data) => {
        //console.error(`${data}`);
    });

    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
    console.log('IMYS API response monitoring...')
}

function SetDebugMode(isDebug) {
    debug = isDebug
}

module.exports = {startMITM, SetDebugMode}
