#!/bin/bash
rm -rfv ./PharmacyManger.API/bin
cd ./PharmacyManager.Frontend/pharmacy-manager
npm run copy-to-server
cd ../../
dotnet publish ./PharmacyManager.API/PharmacyManager.API.csproj --sc --os linux --arch x64 --configuration Release
