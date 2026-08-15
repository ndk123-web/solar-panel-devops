@echo off
setlocal

@REM Set JDK 21 Environment
if exist "C:\Users\Navnath\.antigravity-ide\extensions\redhat.java-1.55.0-win32-x64\jre\21.0.11-win32-x86_64" (
    set "JAVA_HOME=C:\Users\Navnath\.antigravity-ide\extensions\redhat.java-1.55.0-win32-x64\jre\21.0.11-win32-x86_64"
)

@REM Set Maven PATH
if exist "C:\Tools\apache-maven-3.9.6\bin\mvn.cmd" (
    set "PATH=C:\Tools\apache-maven-3.9.6\bin;%JAVA_HOME%\bin;%PATH%"
) else (
    set "PATH=%JAVA_HOME%\bin;%PATH%"
)

echo Using Java: %JAVA_HOME%
mvn %*
