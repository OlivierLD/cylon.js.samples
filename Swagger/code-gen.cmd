@setlocal
@echo off
set YAML=%1
if "%YAML%" == "" (
  @echo Please provide the yaml filename as parameter
  goto eos
)
set SWAGGER_HOME=C:\OlivWork\git\swagger-codegen
set CODEGEN_JAR=%SWAGGER_HOME%\modules\swagger-codegen-cli\build\libs\swagger-codegen-cli-2.2.0-SNAPSHOT.jar
:: java -jar %CODEGEN_JAR% generate -i echo.yaml -l nodejs-server -o %YAML%
java -cp %CODEGEN_JAR% io.swagger.codegen.SwaggerCodegen generate -i %YAML%.yaml -l nodejs-server -o %YAML%
::
cd %YAML%
npm install
::
npm install cylon cylon-speech
::
:eos
@endlocal
