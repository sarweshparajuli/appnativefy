#!/usr/bin/env node

const fs = require('fs');

var yargs = require('yargs');

var nativefier = require('nativefier').default;

var process = require('process');

const request = require('request')


const {
    exec
} = require("child_process");


var blankstr = ""


const dirname = __dirname;
var style = blankstr.concat(__dirname, "/style.css");
console.log(__dirname);
var argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('Make executable AppImages from any Website URL\n\nUsage: $0 [options]')
    .help('help').alias('help', 'h')
    .version('version', '2.0.0').alias('version', 'V')
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
        internalurls: {
            description: "<REGEX> internal urls",
            requiresArg: true,
            required: false
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
    })
    .options({
        blockexternalurls: {
            description: "Block URLs that do not match internal URLs",
        },
        saveAs: {
            description: "Show a 'Save as' dialog, while downloading items",
        },
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


str = argv.name
var name = str.replace(/\s+/g, '-')

var url = argv.url

var appnativefydir = blankstr.concat(process.env['HOME'], "/appnativefy");
try {
    if (!fs.existsSync(appnativefydir)) {
        fs.mkdirSync(appnativefydir);
    }
} catch (err) {
    console.log(err);
}

if (argv.appCopyright === undefined) {
    var appcopyright = "";
} else {
    var appcopyright = argv.appCopyright
}

if (argv.appVersion === undefined) {
    var appversion = "1.0.0";
} else {
    var appversion = argv.appVersion
}

if (argv.widevine === true) {
    var widevine = true
} else {
    var widevine = false
}

const download = (favicongen, icon, callback) => {
    request.head(favicongen, (err, res, body) => {
        request(favicongen)
            .pipe(fs.createWriteStream(icon))
            .on('close', callback)
    })
}

if (argv.favicon === true) {
    var favicon = "true"
} else {
    var favicon = "false"
}

if (argv.services === true) {
    var honest = false
    var services = '"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:85.0) Gecko/20100101 Firefox/85.0"';
    if (argv.internalurls === undefined) {
        var internalurls = '(.*)';
        if (argv.blockexternalurls === true) {
            var blockexternalurls = true;
        } else {
            var blockexternalurls = false
        }
    } else {
        var internalurls = argv.internalurls
    }
} else {
    var honest = true
    var services = ""
    if (argv.internalurls === undefined) {
        var internalurls = ".*?";
    } else {
        var internalurls = argv.internalurls
    }
}

if (argv.saveAs === true) {
    var downloaddialog = true;
} else {
    var downloaddialog = false;
}

if (argv.noOverwrite === true) {
    var overwrite = false;
} else {
    var overwrite = true
}

if (argv.conceal === true) {
    var conceal = true;
} else {
    var conceal = false
}

if (argv.counter === true) {
    var counter = true;
} else {
    var counter = false
}


if (argv.singleinstance === true) {
    var singleinstance = true;
} else {
    var singleinstance = false
}


var options = {
    name: name, // will be inferred if not specified
    targetUrl: url, // required
    platform: 'linux', // defaults to the current system
    arch: 'x64', // defaults to the current system
    copyright: appcopyright,
    version: appversion,
    inject: style,
    out: appnativefydir,
    overwrite: overwrite,
    asar: conceal, // see conceal
    counter: counter,
    bounce: false,
    width: 1280,
    height: 800,
    showMenuBar: false,
    fastQuit: false,
    userAgent: services, // will infer a default for your current system
    ignoreCertificate: false,
    ignoreGpuBlacklist: false,
    enableEs3Apis: false,
    internalUrls: internalurls, // defaults to URLs on same second-level domain as app
    blockExternalUrls: blockexternalurls,
    insecure: false,
    honest: honest,
    widevine: widevine,
    zoom: 1.0,
    singleInstance: singleinstance,
    verbose: false,
    clearCache: false,
    fileDownloadOptions: {
        saveAs: downloaddialog, // always show "Save As" dialog
    },
};

nativefier(options, function (error, appPath) {
    if (error) {
        console.error(error);
        return;
    }
    var apptempdir = appnativefydir.concat("/.appimage-temp");
    var appimagetooldir = appnativefydir.concat("/.appimagetool");

    console.log(appnativefydir);
    try {
        if (!fs.existsSync(apptempdir)) {
            fs.mkdirSync(apptempdir);
        } else {}
    } catch (err) {
        console.log(err);

    }

    try {
        if (!fs.existsSync(appimagetooldir)) {
            fs.mkdirSync(appimagetooldir);
        } else {}
    } catch (err) {
        console.log(err);

    }

    var oldPath = appnativefydir.concat("/", name, "-linux-x64")
    var newPath = apptempdir.concat("/", name, ".AppDir")

    fs.rename(oldPath, newPath, function (err) {
        if (err) throw err
        console.log('Successfully moved file.')
    })

    var scriptsource = blankstr.concat(__dirname, "/script.sh")
    var scriptout = blankstr.concat(appnativefydir, "/.script.sh")
    fs.copyFile(scriptsource, scriptout, (err) => {
        if (err) throw err;
        console.log(scriptsource, 'was copied to', scriptout);
        process.chdir(appnativefydir);
        commandscript = blankstr.concat("chmod 755 ~/appnativefy/.script.sh && ~/appnativefy/.script.sh", " ", name, " ", dirname, " ", favicon, " ", url, "&& rm -rf ~/appnativefy/.script.sh && rm -rf ~/appnativefy/.icon.png"); {
            exec(commandscript, (error, stdout, stderr) => {
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
        };
    });
    var appPath = appnativefydir.concat("/", name, "-x86_64.AppImage")
    console.log('AppImage has been made to', appPath);
});
