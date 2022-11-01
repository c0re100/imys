const fs = require("fs");

exports.default = async function(context) {
    console.log("\n- [IMYS] Copy IMYSProxy to unpacked build...\n");

    fs.copyFileSync('IMYSProxy.exe', './build/win-unpacked/IMYSProxy.exe')
}
