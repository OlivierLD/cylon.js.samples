#!/usr/bin/env bash
#
YAML=$1
if [ -z "$YAML" ]
then
  echo Please provide the yaml file name as parameter
  exit 1
fi
#
CODEGEN_JAR=~/oliv.work/swagger-codegen/modules/swagger-codegen-cli/target/swagger-codegen-cli.jar
#
rm -rf $YAML
#
java -jar $CODEGEN_JAR \
          generate \
          -i $YAML.yaml \
          -l nodejs-server \
          -o $YAML
# Equivalent to:
# java -cp $CODEGEN_JAR \
#          io.swagger.codegen.SwaggerCodegen \
#           generate \
#           -i $YAML.yaml \
#           -l nodejs-server \
#           -o $YAML
cd $YAML
npm install
#
echo Install more stuff here if needed...
nmp install cylon cylon-speech
#
echo Modify the generated code if needed...
#
echo Hit Ctrl\^C to stop
node .
