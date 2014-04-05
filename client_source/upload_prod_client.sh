
echo "Copying client files to PRODUCTION server..."
scp -rp ../client/ www@78.47.92.222:/home/www/powerviz2/prod/
echo "Done"
