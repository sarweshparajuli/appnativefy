#! /bin/bash
name=$1
mkdir ~/AppImage-maker && cd ~/AppImage-maker && mkdir nativefier-appimage-temp
  mv "$name"-linux-x86_64 nativefier-appimage-temp/"$name".AppDir
  mv "$name"-linux-x*64 nativefier-appimage-temp/"$name".AppDir

cd nativefier-appimage-temp
(
  
  cd "$name".AppDir/  
  
iconname="icon.png"

  
echo

    FILE=resources/app/icon.png

if [ -f "$FILE" ]; then
    echo "$FILE exists."
else 
    wget -c "https://raw.githubusercontent.com/sarweshparajuli/nativefier-appimage/main/icon.png" -O resources/app/icon.png
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
[ ! -e /tmp/appimagetool ] && wget https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage -O /tmp/appimagetool
chmod +x /tmp/appimagetool
/tmp/appimagetool "$name.AppDir"

cp *.AppImage ../
cd ..

echo "AppImage built to ~/AppImage-maker/$name-x86_64.AppImage"
