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


console.log(__dirname);
const dirname = __dirname;
var style = blankstr.concat(__dirname, "/style.css");
console.log(style)

var argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('Make executable AppImages from any Website URL\n\nUsage: $0 [options]')
    .help('help').alias('help', 'h')
    .version('version', '1.3.0').alias('version', 'V')
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
        electronVersion: {
            alias: 'e',
            description: "<value> Electron version without the 'v'",
            requiresArg: true,
            required: false
        },

    })
    .options({
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
console.log(appnativefydir);
try {
    if (!fs.existsSync(appnativefydir)) {
        fs.mkdirSync(appnativefydir);
        console.log("Directory is created.");
    } else {
        console.log("Directory already exists.");
    }
} catch (err) {
    console.log(err);
}


if (argv.arch === undefined) {
    var arch = "x64";
} else {
    var arch = argv.arch
}

if (argv.appCopyright === undefined) {
    var appcopyright = "";
} else {
    var appcopyright = blankstr.concat("--app-copyright", " ", '"', argv.appCopyright, '"')
}

if (argv.appVersion === undefined) {
    var appversion = "1.0.0";
} else {
    var appversion = blankstr.concat("--app-version", " ", '"', argv.appVersion, '"')
}

if (argv.electronVersion === undefined) {
    var electronversion = "";
} else {
    var electronversion = blankstr.concat("--electron-version", " ", '"', argv.electronVersion, '"')
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
    var favicongen = blankstr.concat("https://www.google.com/s2/favicons?sz=64&domain_url=", argv.url);
    var icon = appnativefydir.concat("/icon.png");
    var customicon = blankstr.concat('"', icon, '"')
    download(favicongen, icon, () => {
        console.log('✅ Done!')
      })
} else {
    var favicongen = ""
    var icon = ""
}

if (argv.services === true) {
    var honest = false
    var services = '"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:85.0) Gecko/20100101 Firefox/85.0"';
    if (argv.internalurls === undefined) {
        var internalurls = '(.*)';
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


console.log('Inspecting options');

console.log("name:", name);
console.log("url:", url);
console.log("app copyright:", argv.appCopyright);
console.log("app version:", argv.appVersion);
console.log("electron version:", argv.electronVersion);
console.log("widevine support:", widevine);
console.log("services:", argv.services);
console.log("internal urls:", argv.internalurls)
console.log("no overwrite:", argv.noOverwrite);
console.log("conceal:", argv.conceal);
console.log("counter:", argv.counter);
console.log("single instance:", argv.singleinstance)
console.log("css/js injection:", style);

var options = {
    name: name, // will be inferred if not specified
    targetUrl: url, // required
    platform: 'linux', // defaults to the current system
    arch: 'x64', // defaults to the current system
    version: appversion,
    icon: customicon,
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
    blockExternalUrls: true,
    insecure: false,
    honest: honest,
    widevine: widevine,
    zoom: 1.0,
    singleInstance: singleinstance,
    verbose: true,
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
    console.log('App has been nativefied to', appPath);
    var apptempdir = appnativefydir.concat("/.appimage-temp");
    var appimagetooldir = appnativefydir.concat("/.appimagetool");

    console.log(appnativefydir);
    try {
        if (!fs.existsSync(apptempdir)) {
            fs.mkdirSync(apptempdir);
        } else {
        }
    } catch (err) {
        console.log(err);

    }
    try {
        if (!fs.existsSync(appimagetooldir)) {
            fs.mkdirSync(appimagetooldir);          
        } else {
        }
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
        commandscript = blankstr.concat("chmod 755 ~/appnativefy/.script.sh && ~/appnativefy/.script.sh", " ", name, " ", dirname, " ", "&& rm -rf ~/appnativefy/.script.sh && rm -rf ~/appnativefy/.icon.png")
        {
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
    


});
