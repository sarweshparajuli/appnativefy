#! /bin/bash
name=$1
mkdir ~/appnativefy && cd ~/appnativefy && mkdir .appimage-temp
  mv "$name"-linux-x86_64 .appimage-temp/"$name".AppDir
  mv "$name"-linux-x*64 .appimage-temp/"$name".AppDir

cd .appimage-temp
(
  
  cd "$name".AppDir/  
  
iconname="icon.png"

  
echo
    anotherfile=/usr/local/lib/node_modules/appnativefy/icon.png
    FILE=resources/app/icon.png

if [ -f "$FILE" ]; then
    echo "$FILE exists."
else 
    if  -f "$anotherfile" ]; then
    cp  /usr/local/lib/node_modules/appnativefy/icon.png resources/app/icon.png
    else
    wget -c "https://raw.githubusercontent.com/sarweshparajuli/appnativefy/main/icon.png" -O resources/app/icon.png
    fi
fi   

  
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

echo "AppImage built to ~/appnativefy/$name-x86_64.AppImage"
