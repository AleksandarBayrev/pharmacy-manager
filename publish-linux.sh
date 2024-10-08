#!/bin/bash
echo "Cleaning old builds..."
rm -rfv ./**/bin
rm -rfv ./**/obj
rm -rfv ./out
echo "Finished cleaning old builds"
echo "Cleaning node modules..."
rm -rfv ./**/node_modules
echo "Finished cleaning node modules"
echo "Start building FE..."
cd ./PharmacyManager.BaseFrontendUtils/pharmacy-manager-base-frontend-utils
npm install
npm run copy-to-server
cd ../../PharmacyManager.BootstrapFrontend/pharmacy-manager-bootstrap-frontend
npm install
npm run copy-to-server
cd ../../PharmacyManager.Frontend/pharmacy-manager
npm install
npm run copy-to-server
echo "Finished building FE"
cd ../../
echo "Start publishing application..."
dotnet publish ./PharmacyManager.API/PharmacyManager.API.csproj --sc --os linux --arch x64 --configuration Release -p:PublishSingleFile=true -p:DebugType="none" -p:DebugSymbols=false
mkdir out
cp -R ./PharmacyManager.API/bin/Release/net8.0/linux-x64/publish/ out/
echo "Finished publishing application"
