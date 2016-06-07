#!/usr/bin/env bash
CODEGEN_JAR=~/oliv.work/swagger-codegen/modules/swagger-codegen-cli/target/swagger-codegen-cli.jar
#
rm -rf echo
#
java -jar $CODEGEN_JAR \
          generate \
          -i echo.yaml \
          -l nodejs-server \
          -o echo
#
cd echo
npm install
#
echo Install more stuff here if needed...
nmp install cylon cylon-speech
#
echo Modify the generated code if needed...
#
echo Hit Ctrl\^C to stop
node .
