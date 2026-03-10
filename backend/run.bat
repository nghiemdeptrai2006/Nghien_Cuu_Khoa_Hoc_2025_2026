@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-25.0.2
echo ----------------------------------------
echo JAVA_HOME is set to %JAVA_HOME%
echo Running Spring Boot application...
echo ----------------------------------------
.\mvnw.cmd spring-boot:run
