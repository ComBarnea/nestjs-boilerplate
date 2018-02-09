PACKAGE_NAME=$(grep -m1 name package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g')
PACKAGE_VERSION=$(grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g')

docker build . -t $PACKAGE_NAME:$PACKAGE_VERSION -t $PACKAGE_NAME:latest

