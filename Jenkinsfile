pipeline {
    agent any

    stages {
        stage('Node.js Deps') {
            steps {
                echo 'Instalando dependências do Node.js'
            }
            steps {
                sh 'npm install'
            }
        }

        stage('E2E Tests') {
            steps {
                echo 'Executando os Testes E2E'
            }
            steps {
                sh 'npx playwright test'
            }
        }
    }
}