#! /bin/bash
name=$1
mkdir ~/AppImage-maker && cd ~/AppImage-maker && mkdir nativefier-appimage-temp
arch=$2
if [ $arch = "arm" ]; then
   mv "$name"-linux-arm nativefier-appimage-temp/"$name".AppDir
   mv ~/AppImage-maker/arm/"$name"-linux-* ~/AppImage-maker/nativefier-appimage-temp/"$name".AppDir
elif [ $arch = "arm64" ]; then
   mv "$name"-linux-arm64 nativefier-appimage-temp/"$name".AppDir
   mv ~/AppImage-maker/arm64/"$name"-linux-* ~/AppImage-maker/nativefier-appimage-temp/"$name".AppDir
elif [ $arch = "ia32" ]; then
   mv "$name"-linux-ia32 nativefier-appimage-temp/"$name".AppDir
   mv ~/AppImage-maker/ia32/"$name"-linux-* ~/AppImage-maker/nativefier-appimage-temp/"$name".AppDir
else
  mv "$name"-linux-x86_64 nativefier-appimage-temp/"$name".AppDir
fi
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

echo
echo
echo "AppImage built to $PWD/$name-x86_64.AppImage"
echo
echo
echo
