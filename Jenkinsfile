pipeline {
  agent any

  environment {
    CI = 'true'
    DOCKER_REGISTRY = "asskourmohamed"
    IMAGE_BACKEND = "${DOCKER_REGISTRY}/skillmap-backend"
    IMAGE_FRONTEND = "${DOCKER_REGISTRY}/skillmap-frontend"
    SONAR_TOKEN = credentials('sonarqube-token')
    // Test environment variables
    MONGO_URI_TEST = "mongodb://skillmap-mongo:27017/skillmap-test"
    JWT_SECRET_TEST = "test_secret_for_ci"
  }

  tools {
    nodejs 'NodeJS-18'
    sonarQubeScannerInstallation 'SonarScanner'
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
                CORS_ORIGIN=http://localhost:3000 \
                npm test -- --watchAll=false --coverage --runInBand
              '''
            }
          }
        }
        stage('Frontend Tests') {
          steps {
            dir('frontend') {
              sh 'npm test -- --watchAll=false --coverage' 
              }
          }
        }
      }
    }

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('SonarQube') {
          sh '''
            sonar-scanner \
            -Dsonar.projectKey=skillmap-mern \
            -Dsonar.sources=. \
            -Dsonar.host.url=http://sonarqube:9000 \
            -Dsonar.login=${SONAR_TOKEN}
          '''
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 5, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
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

  }

  post {
    success { echo 'Pipeline succeeded — SkillMap deployed!' }
    failure { echo 'Pipeline failed — check logs above.' }
  }
}