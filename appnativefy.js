#!/usr/bin/env node
var yargs = require('yargs');
const { exec } = require("child_process");

var argv = require('yargs/yargs')(process.argv.slice(2))
  .usage('AppImage from website\n\nUsage: $0 [options]')
  .help('help').alias('help', 'h')
  .version('version', '1.0.1').alias('version', 'V')
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
    })  
    .options({
        widevine: {
          description: "Widevine support (for sites with DRM protected content)",
        },
        services: {
              description: "Google/Microsoft 365 sign-in support",
            },
        singleinstance: {
                description: "Single instance of application",
              }
    })
  .argv;
str = argv.name
var name = str.replace(/\s+/g, '-')
var url = argv.url
var inject = "--inject style.css"
if (argv.widevine === true) {
    var widevine = "--widevine";
} else {
    var widevine = ""
}

if (argv.services === true) {
    var services = '--useragent "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:85.0) Gecko/20100101 Firefox/85.0"';
} else {
    var services = "--honest"
}



console.log('Inspecting options');

console.log("name:", name);
console.log("url:", url);
console.log("widevine support:", widevine);
console.log("css/js injection:", inject);
console.log("services:", services);

var npxnativefier = "mkdir -p ~/AppImage-maker && cd ~/AppImage-maker && mkdir -p nativefier-appimage-temp && npx nativefier"

var commandvariable = npxnativefier.concat(" ", '"', url, '"', " ", "--name", " ", '"',name, '"', " ", widevine, " ", services, " ", inject, " ");

console.log(commandvariable);

var appimage = " rm style.css && chmod +x script.sh && ./script.sh"
var appimagescript = appimage.concat(" ", name)

var finalvar = commandvariable.concat('&&', appimagescript, ' && rm -r ~/AppImage-maker/nativefier-appimage-temp', ' && rm -r ~/AppImage-maker/script.sh')
exec("mkdir -p ~/AppImage-maker && cd ~/AppImage-maker && mkdir -p nativefier-appimage-temp && wget -c https://raw.githubusercontent.com/sarweshparajuli/nativefier-appimage/main/style.css && wget -c https://raw.githubusercontent.com/sarweshparajuli/nativefier-appimage/main/script.sh", (error, stdout, stderr) => {
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
