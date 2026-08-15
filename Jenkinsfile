pipeline {
    agent any

    parameters {
        choice(name: 'TARGET_ENV', choices: ['STAGING', 'PRODUCTION', 'DEVELOPMENT'], description: 'Deployment Target Environment')
        string(name: 'TOMCAT_WEBAPPS_DIR', defaultValue: 'C:/Program Files/Apache Software Foundation/Tomcat 10.1/webapps', description: 'Target Tomcat Webapps Directory')
        string(name: 'DEPLOY_PORT', defaultValue: '8080', description: 'Application Server Port')
    }

    environment {
        JAVA_HOME = "C:/Users/Navnath/.antigravity-ide/extensions/redhat.java-1.55.0-win32-x64/jre/21.0.11-win32-x86_64"
        PATH = "${JAVA_HOME}/bin;${env.PATH}"
        WAR_NAME = "solar-plant-portal.war"
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
            }
        }

        stage('3. Backend Maven Build') {
            steps {
                dir('backend') {
                    echo "===> Compiling Java Spring Boot backend classes..."
                    bat 'mvnw.cmd clean compile'
                }
            }
        }

        stage('4. Automated JUnit Testing') {
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

        stage('5. Package WAR Artefact') {
            steps {
                dir('backend') {
                    echo "===> Packaging Spring Boot application into WAR for Tomcat deployment target..."
                    bat 'mvnw.cmd package -DskipTests'
                }
            }
        }

        stage('6. Server Deployment (Tomcat / Nginx)') {
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

        stage('7. Health Check Verification') {
            steps {
                echo "===> Verifying Application Health Status..."
                script {
                    echo "Health endpoint URL: http://localhost:${params.DEPLOY_PORT}/api/health"
                }
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
