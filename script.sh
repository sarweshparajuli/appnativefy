#!/bin/bash -ex
clear
rm -rf appdir/ || true  
rm -rf appimagetoo*.AppImage 
rm  -rf \"\"
while [ -z "$url" ];
do
	clear
	for i in $(seq $(tput cols)); do echo -n '*'; done;
    echo "\e[1;31m Nativefier AppImage Maker \e[0m"
	echo "\e[1;31m Make AppImages from a website using Electron framework and Nativefier to launch it portably. \e[0m"
	for i in $(seq $(tput cols)); do echo -n '*'; done;
	read -p 'URL (MANDATORY): ' url
done

varname="--name"
varicon="-i"
varinternalurls="--internal-urls"
vararchitecture="-a"
varuseragent="--user-agent"
read -p 'Name: ' name
read -p 'Icon <path> (.png): ' icon
read -p 'Internal URLs: ' internalurls
read -p 'User Agent: ' useragent

for i in $(seq $(tput cols)); do echo -n '-'; done;
echo "\e[1;32m Summary \e[0m"
for i in $(seq $(tput cols)); do echo -n '-'; done;

if [ ! -f $varname ] || [ -z "$varname" ]; then
	echo "\e[1;32m Name not supplied, using site name if found. \e[0m"
	name=""
	varname=""
fi
if [ ! -f $icon ] || [ -z "$icon" ]; then
	icon="default/icon.png"
	echo "\e[1;32m File not found/supplied, using default. \e[0m" $icon
fi
if [ ! -f $internalurls ] || [ -z "$internalurls" ]; then
	echo "\e[1;32m Internal URLs not specified. \e[0m" 
	internalurl=""
	varinternalurls=""
fi
if [ ! -f $useragent ] || [ -z "$useragent" ]; then
	echo "\e[1;32m Using default user-agent. \e[0m" 
	useragent=""
	varuseragent="--honest"
fi

for i in $(seq $(tput cols)); do echo -n '-'; done;

nativefier $url $varname \"$name\"  $varicon \"$icon\" $varinternalurls \"$internalurls\"   $varuseragent \"$useragent\" 2> /dev/null

OUTDIR=$(dirname $(dirname $(dirname $(readlink -f $(find . -type f -name 'icon.png'))))| head -n 1) 2> /dev/null
BINNAME=$(basename $(echo $OUTDIR) | cut -d "-" -f 1) 2> /dev/null





mkdir -p appdir/usr/bin
mv "$OUTDIR"/* appdir/usr/bin/
mkdir -p appdir/usr/share/icons/hicolor/256x256/apps/
cp appdir/usr/bin/resources/app/icon.png appdir/usr/share/icons/hicolor/256x256/apps/
cp appdir/usr/share/icons/hicolor/256x256/apps/icon.png appdir/

mkdir -p appdir/usr/share/applications/
cat > appdir/usr/share/applications/nativefied.desktop <<EOF
[Desktop Entry]
Type=Application
Name=$BINNAME
Comment=$BINNAME produced by Nativefier
Icon=icon
Exec=nativefied
Categories=Network;
EOF

cp appdir/usr/share/applications/nativefied.desktop appdir/

mv appdir/usr/bin/$BINNAME appdir/usr/bin/nativefied

cat > appdir/AppRun <<\EOF
#!/bin/bash
HERE="$(dirname "$(readlink -f "${0}")")"
# https://github.com/AppImage/AppImageKit/issues/1039
if [ $(sysctl kernel.unprivileged_userns_clone | cut -d " " -f 3) != "1" ] ; then
  echo "Working around systems without unprivileged_userns_clone using --no-sandbox"
  exec "${HERE}/usr/bin/nativefied" "$@" --no-sandbox
else
  exec "${HERE}/usr/bin/nativefied" "$@"
fi
EOF
chmod +x appdir/AppRun

wget -c https://github.com/$(wget -q https://github.com/probonopd/go-appimage/releases -O - | grep "appimagetool-.*-x86_64.AppImage" | head -n 1 | cut -d '"' -f 2)
chmod +x appimagetool-*.AppImage
./appimagetool-*.AppImage deploy ./appdir/usr/share/applications/*.desktop # Bundle everything expect what comes with the base system

find appdir/ -type f -name '*libnss*' -delete

VERSION=$(date +"%Y%m%d") ./appimagetool-*.AppImage ./appdir # turn AppDir into AppImage




chmod +x *.AppImage
rm -rf appdir/ || true  1> /dev/null
rm -rf appimagetoo*.AppImage 1> /dev/null
rm  -rf \"\" 1> /dev/null
