pipeline {
  agent any

  environment {
    CI = 'true'
    DOCKER_REGISTRY = "asskourmohamed"
    IMAGE_BACKEND = "${DOCKER_REGISTRY}/skillmap-backend"
    IMAGE_FRONTEND = "${DOCKER_REGISTRY}/skillmap-frontend"
    SONAR_TOKEN = credentials('sonarqube-token')
    MONGO_URI_TEST = "mongodb://skillmap-mongo:27017/skillmap-test"
    JWT_SECRET_TEST = "test_secret_for_ci"
    NVD_API_KEY = credentials('093de779-5619-408c-9479-230b0170e8cd')
  }

  tools {
    nodejs 'NodeJS-18'
    'hudson.plugins.sonar.SonarRunnerInstallation' 'SonarQube Scanner'
  }

  stages {

    stage('Checkout') {
      steps {
        git branch: 'main',
            url: 'https://github.com/asskourmohamed/SkillMap-MERN'
      }
    }

    stage('Install Dependencies') {
      parallel {
        stage('Backend') {
          steps {
            dir('backend') { sh 'npm install' }
          }
        }
        stage('Frontend') {
          steps {
            dir('frontend') { sh 'npm install' }
          }
        }
      }
    }

    stage('Run Tests') {
      parallel {
        stage('Backend Tests') {
          steps {
            dir('backend') {
              sh '''
                MONGO_URI=${MONGO_URI_TEST} \
                JWT_SECRET=${JWT_SECRET_TEST} \
                PORT=5001 \
                JWT_EXPIRE=7d \
                npm test -- --watchAll=false --coverage
              '''
            }
          }
        }
        stage('Frontend Tests') {
          steps {
            dir('frontend') {
              sh 'npm test -- --watchAll=false --coverage --watchAll=false'
            }
          }
        }
      }
    }

    stage ( 'OWASP Dependency Check' ) {
      steps {
        withCredentials([string(credentialsId: '093de779-5619-408c-9479-230b0170e8cd', variable: 'NVD_KEY')]) {
        dependencyCheck additionalArguments: """
            --scan backend/package.json
            --scan frontend/package.json
            --format HTML
            --format XML
            --out dependency-check-report
            --nvdApiKey ${NVD_API_KEY}
            --failOnCVSS 11
        """, odcInstallation: 'OWASP-DC'
        }
        dependencyCheckPublisher pattern: 'dependency-check-report/dependency-check-report.xml'
    }
  }

    stage('SonarQube Analysis') {
      steps {
        script {
            def scannerHome = tool 'SonarQube Scanner'
            withSonarQubeEnv('SonarQube') {
                sh """
                    ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=SkillMap-MERN \
                        -Dsonar.sources=backend,frontend/src \
                        -Dsonar.exclusions=**/node_modules/**,**/build/**,**/coverage/**  \
                        -Dsonar.host.url=http://sonarqube:9000 \
                        -Dsonar.javascript.lcov.reportPaths=backend/coverage/lcov.info,frontend/coverage/lcov.info
                """
            }
        }
    }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 30, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }
    stage ( 'Trivy Filesystem Scan' ) {
      steps {
        sh '''
            export TRIVY_HOME=${WORKSPACE}/.trivy
            mkdir -p ${TRIVY_HOME}

            which trivy || {
                curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh \
                | sh -s -- -b ${TRIVY_HOME}
            }

            export PATH=${TRIVY_HOME}:$PATH

            trivy fs --exit-code 0 --severity HIGH,CRITICAL \
                --format table ./backend
            trivy fs --exit-code 0 --severity HIGH,CRITICAL \
                --format table ./frontend
            trivy fs --exit-code 0 --severity CRITICAL \
                --format json --output trivy-fs-report.json .
        '''
        archiveArtifacts artifacts: 'trivy-fs-report.json', allowEmptyArchive: true
    }
  }

    stage('Docker Build & Push') {
      steps {
        script {
          docker.build("${IMAGE_BACKEND}:${BUILD_NUMBER}", './backend')
          docker.build("${IMAGE_FRONTEND}:${BUILD_NUMBER}", './frontend')

          docker.withRegistry("https://registry.hub.docker.com", 'registry-creds') {
            docker.image("${IMAGE_BACKEND}:${BUILD_NUMBER}").push()
            docker.image("${IMAGE_FRONTEND}:${BUILD_NUMBER}").push()
            docker.image("${IMAGE_BACKEND}:${BUILD_NUMBER}").push('latest')
            docker.image("${IMAGE_FRONTEND}:${BUILD_NUMBER}").push('latest')
          }
        }
      }
    }
    stage ( 'Trivy Image Scan' ) {
      steps {
          sh """
              trivy image --exit-code 0 --severity HIGH,CRITICAL \
                  --format table \
                  ${IMAGE_BACKEND}:${BUILD_NUMBER}

              trivy image --exit-code 0 --severity HIGH,CRITICAL \
                  --format table \
                  ${IMAGE_FRONTEND}:${BUILD_NUMBER}

              # Fail pipeline on CRITICAL CVEs in either image
              trivy image --exit-code 1 --severity CRITICAL \
                  --format json \
                  --output trivy-image-backend.json \
                  ${IMAGE_BACKEND}:${BUILD_NUMBER}

              trivy image --exit-code 1 --severity CRITICAL \
                  --format json \
                  --output trivy-image-frontend.json \
                  ${IMAGE_FRONTEND}:${BUILD_NUMBER}
          """
          archiveArtifacts artifacts: 'trivy-image-*.json', allowEmptyArchive: true
      }
  }

  }


  post {
    success { 
      echo 'Pipeline succeeded SkillMap deployed !'
      emailext (
        subject: "SUCCESS: SkillMap-MERN Build #${BUILD_NUMBER}",
        body: "Pipeline succeeded. View at ${BUILD_URL}",
        to: 'asskourmohamed1@gmail.com',
        recipientProviders: [[$class: 'DevelopersRecipientProvider']]
      )
    }
    failure { 
      echo 'Pipeline failed check logs above.'
      emailext (
        subject: "FAILURE: SkillMap-MERN Build #${BUILD_NUMBER}",
        body: "Pipeline failed. View at ${BUILD_URL}",
        to: 'asskourmohamed1@gmail.com',
        recipientProviders: [[$class: 'DevelopersRecipientProvider']]
      )
    }
  }
}