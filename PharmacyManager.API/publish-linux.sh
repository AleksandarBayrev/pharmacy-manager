#!/bin/bash
rm -rfv ./bin
dotnet publish --sc --os linux --arch x64 --configuration Release