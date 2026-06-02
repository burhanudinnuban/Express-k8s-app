pipeline {
    agent any

    environment {
        REGISTRY      = "10.10.1.70:5000"
        APP_NAME      = "express-api"
        GITOPS_REPO   = "git@github.com:burhanudinnuban/Express-k8s-gitops.git"
        GITOPS_BRANCH = "main"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Set Version') {
            steps {
                script {
                    env.IMAGE_TAG = "v${BUILD_NUMBER}"
                    env.FULL_IMAGE = "${REGISTRY}/${APP_NAME}:${IMAGE_TAG}"
                    echo "Building image: ${FULL_IMAGE}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${FULL_IMAGE} ."
            }
        }

        stage('Push to Registry') {
            steps {
                sh "docker push ${FULL_IMAGE}"
            }
        }

        stage('Update GitOps Repo') {
            steps {
                sshagent(['github-ssh']) {
                    sh '''
                        rm -rf gitops-temp
                        git clone ${GITOPS_REPO} gitops-temp
                        cd gitops-temp

                        sed -i "s|image: ${REGISTRY}/${APP_NAME}:.*|image: ${FULL_IMAGE}|g" deployment.yaml

                        git config user.name "Jenkins CI"
                        git config user.email "jenkins@10.10.3.65"
                        git add deployment.yaml
                        git commit -m "Deploy ${APP_NAME}:${IMAGE_TAG} via Jenkins #${BUILD_NUMBER}"
                        git push origin ${GITOPS_BRANCH}

                        cd ..
                        rm -rf gitops-temp
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ SUCCESS! Image: ${FULL_IMAGE}"
            echo "🔄 ArgoCD will auto-sync in ~3 minutes"
        }
        failure {
            echo "❌ PIPELINE FAILED!"
        }
    }
}
