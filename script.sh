#!/usr/bin/env bash
name=$1
dirname=$2
favicon=$3
mkdir -p ~/appnativefy && cd ~/appnativefy && mkdir -p .appimage-temp
cd .appimage-temp
(
  cd "$name".AppDir/  
  mkdir -p ~/appnativefy/.appimage-temp/"$name".AppDir/resources/app/inject
  cp $2/style.css ~/appnaivefy/.appimage-temp/"$name".AppDir/resources/app/inject/style.css
  iconname="icon.png"

  
  echo
    anotherfile=/usr/local/lib/node_modules/appnativefy/icon.png
    FILE=resources/app/icon.png
    b="true"

  if [ "$favicon" = "$b" ]; then 
    favicon="https://www.google.com/s2/favicons?sz=64&domain_url="
    faviconlink=$favicon$4

    wget $faviconlink -O  resources/app/icon.png
  fi

  if [ -f "$FILE" ]; then
    echo "$FILE exists."
  else 
    if  -f "$anotherfile" ]; then
      cp  /usr/local/lib/node_modules/appnativefy/icon.png resources/app/icon.png
    else
      wget -c "https://raw.githubusercontent.com/sarweshparajuli/appnativefy/main/icon.png" -O resources/app/icon.png
    fi
  fi   

  cp $dirname/style.css resources/app/inject/inject.css



  cp resources/app/icon.png icon.png

  
  
  echo "[Desktop Entry]" > $name.desktop
  echo "Name=$name" >> $name.desktop
  echo "Exec=AppRun %U" >> $name.desktop
  echo "Terminal=false" >> $name.desktop
  echo "Type=Application" >> $name.desktop
  echo "Icon=${iconname%.*}" >> $name.desktop
  echo "X-AppImage-Version=1.0.0" >> $name.desktop
  echo "Categories=Network;WebBrowser;" >> $name.desktop
  
  echo "#!/bin/bash" > AppRun
  echo "exec \$APPDIR/$name" >> AppRun
  chmod +x ./AppRun
)
mkdir -p ~/appnativefy/.appimagetool
[ ! -e ~/appnativefy/.appimagetool/appimagetool ] && wget https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage -O ~/appnativefy/.appimagetool/appimagetool
chmod +x ~/appnativefy/.appimagetool/appimagetool
~/appnativefy/.appimagetool/appimagetool "$name.AppDir"



cp *.AppImage ../
cd ..
rm -r ~/appnativefy/.appimage-temp
rm -r ~/appnativefy/.script.sh
rm -rf ~/appnativefy/icon.png