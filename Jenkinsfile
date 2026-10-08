pipeline {
    agent any

    parameters {
        choice(name: 'TARGET_ENV', choices: ['STAGING', 'PRODUCTION', 'DEVELOPMENT'], description: 'Deployment Target Environment')
        string(name: 'TOMCAT_WEBAPPS_DIR', defaultValue: 'C:/Program Files/Apache Software Foundation/Tomcat 10.1/webapps', description: 'Target Tomcat Webapps Directory')
        string(name: 'DEPLOY_PORT', defaultValue: '8080', description: 'Application Server Port')
        string(name: 'DOCKER_BACKEND_PORT', defaultValue: '8082', description: 'Host port for the Docker backend container')
        string(name: 'DOCKER_FRONTEND_PORT', defaultValue: '3001', description: 'Host port for the Docker frontend container')
    }

    environment {
        JAVA_HOME = "C:/Program Files/Java/jdk-21.0.11"
        PATH = "${JAVA_HOME}/bin;${env.PATH}"
        WAR_NAME = "solar-plant-portal.war"
        IMAGE_TAG = "${BUILD_NUMBER}"
        BACKEND_HOST_PORT = "${params.DOCKER_BACKEND_PORT}"
        FRONTEND_HOST_PORT = "${params.DOCKER_FRONTEND_PORT}"
    }

    stages {
        stage('1. Checkout Source Code') {
            steps {
                echo "===> Pulling latest commit for Solar Plant Maintenance Portal (NAVNATH KADAM)..."
                checkout scm
            }
        }

        stage('2. Environment Verification') {
            steps {
                echo "===> Verifying Build Tools & Java Environment..."
                bat 'java -version'
                bat 'node --version'
                bat 'npm --version'
                bat 'docker --version'
                bat 'docker info'
            }
        }

        stage('3. Frontend Build') {
            steps {
                dir('frontend') {
                    echo "===> Building Next.js frontend..."
                    bat 'npm ci'
                    bat 'npm run build'
                }
            }
        }

        stage('4. Backend Maven Build') {
            steps {
                dir('backend') {
                    echo "===> Compiling Java Spring Boot backend classes..."
                    bat 'mvnw.cmd clean compile'
                }
            }
        }

        stage('5. Automated JUnit Testing') {
            steps {
                dir('backend') {
                    echo "===> Running automated backend unit tests..."
                    bat 'mvnw.cmd test'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'backend/target/surefire-reports/*.xml'
                }
            }
        }

        stage('6. Package WAR Artefact') {
            steps {
                dir('backend') {
                    echo "===> Packaging Spring Boot application into WAR for Tomcat deployment target..."
                    bat 'mvnw.cmd package -DskipTests'
                }
            }
        }

        stage('7. Selenium Browser Testing') {
            steps {
                script {
                    echo "===> Starting backend and frontend for Selenium browser tests..."
                    bat 'powershell -NoProfile -Command "$p = Start-Process -FilePath \'cmd.exe\' -ArgumentList \'/c set SPRING_DATASOURCE_URL=jdbc:sqlite:selenium_plant.db&& mvnw.cmd spring-boot:run ^> ..\\backend-startup.log 2^>^&1\' -WorkingDirectory \'backend\' -PassThru -WindowStyle Hidden; Set-Content -Path .backend.pid -Value $p.Id"'
                    bat 'powershell -NoProfile -Command "$p = Start-Process -FilePath \'cmd.exe\' -ArgumentList \'/c npm run start ^> ..\\frontend-startup.log 2^>^&1\' -WorkingDirectory \'frontend\' -PassThru -WindowStyle Hidden; Set-Content -Path .frontend.pid -Value $p.Id"'
                    bat 'powershell -NoProfile -Command "$deadline = (Get-Date).AddMinutes(2); do { try { $r = Invoke-WebRequest -Uri \'http://localhost:8080/api/health\' -UseBasicParsing -TimeoutSec 5; if ($r.StatusCode -eq 200) { exit 0 } } catch {}; Start-Sleep -Seconds 3 } while ((Get-Date) -lt $deadline); Write-Error \'Backend health check timed out. Backend startup log:\'; if (Test-Path backend-startup.log) { Get-Content backend-startup.log }; exit 1"'
                    bat 'powershell -NoProfile -Command "$deadline = (Get-Date).AddMinutes(2); do { try { $r = Invoke-WebRequest -Uri \'http://localhost:3000\' -UseBasicParsing -TimeoutSec 5; if ($r.StatusCode -eq 200) { exit 0 } } catch {}; Start-Sleep -Seconds 3 } while ((Get-Date) -lt $deadline); Write-Error \'Frontend health check timed out. Frontend startup log:\'; if (Test-Path frontend-startup.log) { Get-Content frontend-startup.log }; exit 1"'
                    dir('backend') {
                        bat 'mvnw.cmd -Pselenium test'
                    }
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'backend/target/surefire-reports/*.xml'
                    bat 'powershell -NoProfile -Command "foreach ($file in @(\'.backend.pid\', \'.frontend.pid\')) { if (Test-Path $file) { $processId = Get-Content $file; Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue; Remove-Item $file -Force } }"'
                }
            }
        }

        stage('8. Server Deployment (Tomcat / Nginx)') {
            steps {
                echo "===> Deploying ${WAR_NAME} to ${params.TARGET_ENV} server at ${params.TOMCAT_WEBAPPS_DIR}..."
                script {
                    def warSource = "backend/target/${env.WAR_NAME}"
                    echo "Deploying artifact ${warSource} to environment target [${params.TARGET_ENV}]"
                    
                    // Windows deployment copy step for Tomcat webapps
                    bat """
                        if exist "${params.TOMCAT_WEBAPPS_DIR}" (
                            copy /Y "backend\\target\\${env.WAR_NAME}" "${params.TOMCAT_WEBAPPS_DIR}\\"
                            echo Successfully deployed ${env.WAR_NAME} to Tomcat webapps folder.
                        ) else (
                            echo Target Tomcat directory non-existent or local mock deployment. WAR file is ready at backend\\target\\${env.WAR_NAME}
                        )
                    """
                }
            }
        }

        stage('9. Docker Image Build and Deployment') {
            steps {
                echo "===> Building and deploying versioned Docker images..."
                bat 'docker compose build'
                bat 'docker compose up -d --force-recreate'
            }
            post {
                always {
                    bat 'docker compose ps'
                }
            }
        }

        stage('10. Docker Health Check Verification') {
            steps {
                echo "===> Verifying containerized application health..."
                bat 'powershell -NoProfile -Command "$uri = \'http://localhost:\' + $env:BACKEND_HOST_PORT + \'/api/health\'; $deadline = (Get-Date).AddMinutes(2); do { try { $r = Invoke-WebRequest -Uri $uri -UseBasicParsing -TimeoutSec 5; if ($r.StatusCode -eq 200) { Write-Host \'Backend container is healthy\'; exit 0 } } catch {}; Start-Sleep -Seconds 3 } while ((Get-Date) -lt $deadline); docker compose logs; exit 1"'
                bat 'powershell -NoProfile -Command "$uri = \'http://localhost:\' + $env:FRONTEND_HOST_PORT; $deadline = (Get-Date).AddMinutes(2); do { try { $r = Invoke-WebRequest -Uri $uri -UseBasicParsing -TimeoutSec 5; if ($r.StatusCode -eq 200) { Write-Host \'Frontend container is healthy\'; exit 0 } } catch {}; Start-Sleep -Seconds 3 } while ((Get-Date) -lt $deadline); docker compose logs; exit 1"'
            }
        }
    }

    post {
        success {
            echo "===> SUCCESS: Solar Plant Maintenance Portal Pipeline completed successfully!"
            archiveArtifacts artifacts: 'backend/target/*.war', allowEmptyArchive: false
        }
        failure {
            echo "===> FAILURE: Pipeline failed. Check build logs above."
        }
    }
}
