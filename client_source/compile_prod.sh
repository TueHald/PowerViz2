#The "compile" script for the PowerViz2 application.
tsc --out ../client/Main.js --target ES5 Main.ts
cp index.html ../client/index.html
cp mainstyle.css ../client/mainstyle.css
cp -r Fonts/ ../client/Fonts/
cp -r Images/ ../client/Images/
cp -r libs/ ../client/libs/
sh upload_prod_client.sh

