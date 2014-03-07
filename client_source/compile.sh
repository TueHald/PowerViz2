#The "compile" script for the PowerViz2 application.
tsc --out ../client/Main.js --target ES5 Main.ts
cp index.html ../client/index.html
cp mainstyle.css ../client/mainstyle.css

