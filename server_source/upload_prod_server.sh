
echo "Copying server files to PRODUCTION server..."
scp -rp ../server/ www@78.47.92.222:/home/www/powerviz2/prod/
echo "Done"
