pipeline {
    agent any

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
            }
        }
    }
}