#!/bin/bash
echo "Cleaning old builds..."
rm -rfv ./**/bin
rm -rfv ./**/obj
echo "Finished cleaning old builds"
echo "Start building FE..."
cd ./PharmacyManager.BaseFrontendUtils/pharmacy-manager-base-frontend-utils
npm install
npm run copy-to-server
cd ../../PharmacyManager.Frontend/pharmacy-manager
npm install
npm run copy-to-server
echo "Finished building FE"
cd ../../
echo "Start publishing application..."
dotnet publish ./PharmacyManager.API/PharmacyManager.API.csproj --sc --os linux --arch x64 --configuration Release
echo "Finished publishing application"