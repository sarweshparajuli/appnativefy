#!/usr/bin/env node

var yargs = require('yargs');
const {
    exec
} = require("child_process");
console.log(__dirname);
var argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('Make executable AppImages from any Website URL\n\nUsage: $0 [options]')
    .help('help').alias('help', 'h')
    .version('version', '1.1.8').alias('version', 'V')
    .options({
        name: {
            alias: 'n',
            description: "<name> Input website name",
            requiresArg: true,
            required: true
        },
        url: {
            alias: 'u',
            description: "<url> Website url",
            requiresArg: true,
            required: true
        },
        appCopyright: {
            description: "<value> Copyright information",
            requiresArg: true,
            required: false
        },
        appVersion: {
            description: "<value> App version info",
            requiresArg: true,
            required: false
        },
        electronVersion: {
            alias: 'e',
            description: "<value> Electron version without the 'v'",
            requiresArg: true,
            required: false
        },

    })
    .options({
        favicon: {
            description: "Force use website favicon, as AppImage icon",
        },
        widevine: {
            description: "Widevine support (for sites with DRM protected content)",
        },
        services: {
            description: "Google/Microsoft 365 sign-in support",
        },
        noOverwrite: {
            description: "Specifies if destination directory should not be overwritten",
        },
        conceal: {
            description: "Conceals the source code within the AppImage into an archive",
        },
        counter: {
            description: "Use a counter that persists even with window focus for the application badge",
        },
        singleinstance: {
            description: "Single instance of application",
        },
        disablegpu: {
            description: "Disable hardware acceleration"
        }
    })
    .argv;

var blankstr = ""

str = argv.name
var name = str.replace(/\s+/g, '-')

var url = blankstr.concat('"', argv.url, '"')

if (argv.arch === undefined) {
    arch = "x64";
} else {
    var arch = argv.arch
}

if (argv.appCopyright === undefined) {
    var appcopyright = "";
} else {
    var appcopyright = blankstr.concat("--app-copyright", " ", '"', argv.appCopyright, '"')
}

if (argv.appVersion === undefined) {
    var appversion = "";
} else {
    var appversion = blankstr.concat("--app-version", " ", '"', argv.appVersion, '"')
}

if (argv.electronVersion === undefined) {
    var electronversion = "";
} else {
    var electronversion = blankstr.concat("--electron-version", " ", '"', argv.electronVersion, '"')
}

var inject = "--inject style.css"

if (argv.widevine === true) {
    var widevine = "--widevine";
} else {
    var widevine = ""
}

if (argv.favicon === true) {
    var favicongen = blankstr.concat(" && wget ", '"', "https://www.google.com/s2/favicons?sz=64&domain_url=", argv.url, '"', " ", "-O icon.png ");
    var icon = '--icon "icon.png"'
} else {
    var favicongen = ""
    var icon = ""
}

if (argv.services === true) {
    var services = '--user-agent "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:85.0) Gecko/20100101 Firefox/85.0" --internal-urls "(.*)"';
} else {
    var services = "--honest"
}

if (argv.noOverwrite === true) {
    var nooverwrite = '--no-overwrite "true"';
} else {
    var nooverwrite = ""
}

if (argv.conceal === true) {
    var conceal = "--conceal";
} else {
    var conceal = ""
}

if (argv.counter === true) {
    var counter = "--counter";
} else {
    var counter = ""
}

if (argv.singleinstance === true) {
    var singleinstance = "--single-instance";
} else {
    var singleinstance = ""
}


console.log('Inspecting options');

console.log("name:", name);
console.log("url:", url);
console.log("app copyright:", argv.appCopyright);
console.log("app version:", argv.appVersion);
console.log("electron version:", argv.electronVersion);
console.log("widevine support:", argv.widevine);
console.log("services:", argv.services);
console.log("no overwrite:", argv.noOverwrite);
console.log("conceal:", argv.conceal);
console.log("counter:", argv.counter);
console.log("single instance:", argv.singleinstance)
console.log("css/js injection:", inject);

var npxnativefier = blankstr.concat("mkdir -p ~/AppImage-maker && cd ~/AppImage-maker && mkdir -p nativefier-appimage-temp", " ", favicongen, " && ", __dirname, "/node_modules/nativefier/lib/cli.js")

///var commandvariable = npxnativefier.concat(" ", '"', url, '"', " ", "--name", " ", '"', name, '"', " ", widevine, " ", services, " ", singleinstance, " ", inject, " ");

var commandvariable = npxnativefier.concat(" ", url, " ", "--name", " ", '"', name, '"', " ", icon, " ", appcopyright, " ", appversion, " ", electronversion, " ", widevine, " ", services, " ", nooverwrite, " ", conceal, " ", counter, " ", singleinstance, " ", inject, " ")

console.log(commandvariable);

var appimage = " rm style.css && rm -rf icon.png && "
var appimagescript = appimage.concat(" sh script.sh", " ", name, " ")

var almostfinalvar = commandvariable.concat('&&', appimagescript, ' && rm -r ~/AppImage-maker/nativefier-appimage-temp', ' && rm -r ~/AppImage-maker/script.sh ')

var downloads = blankstr.concat("mkdir -p ~/AppImage-maker && cd ~/AppImage-maker && mkdir -p nativefier-appimage-temp && cp", " ", __dirname, "/style.css style.css && cp", " ", __dirname, "/script.sh script.sh")

var endofscript = blankstr.concat("echo ", '"', "AppImage built to ~/AppImage-maker/", name, "-x86_64.AppImage", '"')

var finalvar = blankstr.concat(downloads, " ", "&&", " ", almostfinalvar, " ", "&&", " ", endofscript)


exec(finalvar, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

var trueendofscript = blankstr.concat("AppImage building to ~/AppImage-maker/", name, "-x86_64.AppImage")
console.log(trueendofscript);
