#!/bin/sh

SCRIPTPATH="$(
  cd "$(dirname "$0")" >/dev/null 2>&1
  pwd -P
)"

###
# Arg 1 : Command
# Arg 2 : Install script
###
print_cmd_error() {
  printf "Command not found : $1\n"
  [ ! -z "$2" ] && printf "Run this command to install : $2\n"

  exit 1
}


HELPTEXT="Usage :
  $0 <name> <url> <icon> -- [extra nativefier options]

  <name> : Name of the application
  <url>  : Url of the webpage to package
  <icon> : Icon of the appimage"

opts=$(echo $@ | awk -F ' -- ' '{print $1}')
extra_nativefier_opts=$(echo $@ | awk -F ' -- ' '{print $2}')

name=$(echo $opts | cut -d ' ' -f 1)
url=$(echo $opts | cut -d ' ' -f 2)
icon=$(echo $opts | cut -d ' ' -f 3)
favicongen="https://www.google.com/s2/favicons?sz=64&domain_url="
icon=$favicongen$url
if [ -z "$name" -o -z "$url" -o -z "$icon" ]; then
  printf "$HELPTEXT\n"
  exit 1
fi
iconname="icon.png"
wget -c --no-cache "https://raw.githubusercontent.com/sarweshparajuli/nativefier-appimage/main/style.css"
wget -c "https://nodejs.org/dist/v12.16.3/node-v12.16.3-linux-x64.tar.xz"
tar xf node-*-linux-x64.tar.xz >/dev/null 2>&1
./node-*-linux-x64/bin/node ./node-*-linux-x64/bin/npm install nativefier -g >/dev/null 2>&1

(
  if [ -d "$name.AppDir" ]; then
    printf "WARNING : \`$name.AppDir\` directory already exists. Re-using AppDir\n"
  else
    ./node-*-linux-x64/bin/node ./node-*-linux-x64/bin/nativefier -n "$name" -p linux "$url" --inject "style.css" --user-agent "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:85.0) Gecko/20100101 Firefox/85.0" --internal-urls "(.*)" $extra_nativefier_opts  >/dev/null 2>&1
    mv "$name"-linux-* "$name.AppDir"
  fi
  rm style.css
  cd "$name".AppDir/  
  

  if [[ $icon = http* ]]; then
    printf "Downloading $iconname : $icon\n" >/dev/null 2>&1
    wget -q -nv -O $iconname $icon &> /dev/null
  elif [ -e $icon ]; then
    printf "Copying $iconname : $icon\n" >/dev/null 2>&1
    cp $icon ./$iconname
  else
    printf "ERROR : Invalid icon url / path. Please provide a http link or a local path"
    exit 1
  fi
  echo 'Use' $name".AppDir/icon.png as icon or," $name".AppDir/resources/app/icon.png"
  read -p '[1,2]? '$varicon
  vartrue="1"
  if [ $varicon == $vartrue ]
  then
    rm resources/app/icon.png && cp icon.png resources/app/icon.png
  else
    rm icon.png && cp resources/app/icon.png icon.png
  fi
  
  
  echo "[Desktop Entry]" > $name.desktop
  echo "Name=$name" >> $name.desktop
  echo "Exec=AppRun %U" >> $name.desktop
  echo "Terminal=false" >> $name.desktop
  echo "Type=Application" >> $name.desktop
  echo "Icon=${iconname%.*}" >> $name.desktop
  echo "X-AppImage-Version=1.0.0" >> $name.desktop
  echo "Categories=Utility;" >> $name.desktop
  
  echo "#!/bin/bash" > AppRun
  echo "exec \$APPDIR/$name" >> AppRun
  chmod +x ./AppRun
)

[ ! -e /tmp/appimagetool ] && wget https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage -O /tmp/appimagetool
chmod +x /tmp/appimagetool

/tmp/appimagetool "$name.AppDir"

rm -r ./$name.AppDir >/dev/null
