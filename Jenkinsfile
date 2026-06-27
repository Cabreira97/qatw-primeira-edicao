pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.61.0-noble'
            args '--network qatw-primeira-edicao_skynet'
        }
    }

    stages {
        stage('Node.js Deps') {
            steps {
                echo 'Instalando dependências do Node.js'
                sh 'npm install'
            }
        }

        stage('E2E Tests') {
            steps {
                echo 'Executando os Testes E2E'
                sh 'npx playwright test'
                allure commandline: 'allure', includeProperties: false, jdk: '', resultPolicy: 'LEAVE_AS_IS', results: [[path: 'allure-results']]
            }
        }
    }
}