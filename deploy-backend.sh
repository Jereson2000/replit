#! /bin/bash
set -euxo pipefail

# USE RELATIVE PATHS!!
read -p "Give PATH to backend (include /. at the end of path): " PATH_BACKEND
read -p "Give PATH to frontend (include /. at the end of path): " PATH_FRONTEND

read -p "Are you sure you want these paths? "$PATH_BACKEND" "$PATH_FRONTEND" (Y/N): " \
  confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1

echo "Copying backend"
cp -r "$PATH_BACKEND" ./backend/

echo "Deleting node modules"
rm -rf ./backend/node_modules

echo "Deleting dist"
rm -rf ./backend/dist

echo "Copying frontend"
cp -r "$PATH_FRONTEND" ./frontend/

echo "Building frontend"
#Maybe all of these are not needed but en oo tutustunu.
cd frontend 
rm -rf node_modules 
npm install 
npm run build 
cd ..

echo "Copying dist"
cp -r ./frontend/dist ./backend/

echo "Pushing code to github to activate replit"
git add backend && git commit -m "deploy render " && git push
