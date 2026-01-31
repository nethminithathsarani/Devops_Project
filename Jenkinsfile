pipeline {
    agent any

    tools {
        // Use Jenkins-managed NodeJS tool so npm is available to the agent.
        nodejs 'Node20'
    }

    // Build on every GitHub push so Jenkins stays in sync with repo state.
    triggers {
        githubPush()
    }

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-login')
        AWS_CREDENTIALS       = credentials('aws-creds')
        FRONT_IMAGE           = 'nethmini12/personal-blog-frontend'
        BACK_IMAGE            = 'nethmini12/personal-blog-backend'
        IMAGE_TAG             = 'latest'
    }

    options {
        skipDefaultCheckout(true) // Avoid implicit checkout so we can control it in the stage.
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                // Explicit checkout keeps the workspace clean and allows branch overrides from the job.
                checkout scm
                script {
                    env.SHORT_COMMIT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                }
            }
        }

        stage('Install') {
            steps {
                // Cache npm downloads locally to speed up re-runs on the same agent.
                dir('frontend') {
                    sh 'npm ci --cache $HOME/.npm --prefer-offline'
                }
                dir('backend') {
                    sh 'npm ci --cache $HOME/.npm --prefer-offline'
                }
            }
        }



        stage('Build') {
            steps {
                // Build the production React bundle to fail fast before container builds.
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    // Use the commit SHA tag for traceability alongside latest.
                    def commitTag = env.SHORT_COMMIT ?: env.IMAGE_TAG
                    sh "docker build -f frontend/Dockerfile -t ${FRONT_IMAGE}:latest -t ${FRONT_IMAGE}:${commitTag} ."
                    sh "docker build -f backend/Dockerfile -t ${BACK_IMAGE}:latest -t ${BACK_IMAGE}:${commitTag} backend"
                }
            }
        }

        stage('Docker Push') {
            steps {
                // Push both frontend and backend images so deploy can pull by tag.
                sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"
                script {
                    def commitTag = env.SHORT_COMMIT ?: env.IMAGE_TAG
                    sh "docker push ${FRONT_IMAGE}:latest"
                    sh "docker push ${FRONT_IMAGE}:${commitTag}"
                    sh "docker push ${BACK_IMAGE}:latest"
                    sh "docker push ${BACK_IMAGE}:${commitTag}"
                }
            }
        }

        stage('Deploy') {
            steps {
                // Ship the compose + nginx config and run docker compose on the EC2 host Jenkins manages.
                withCredentials([file(credentialsId: 'ec2-ssh-key', variable: 'KEY_FILE')]) {
                    sh '''
                        set -e
                        EC2_IP=$(cd terraform && terraform output -raw jenkins_public_ip)

                        # Prepare remote workspace with current compose + nginx config.
                        ssh -i $KEY_FILE -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ubuntu@$EC2_IP "mkdir -p /home/ubuntu/personal-blog"
                        scp -i $KEY_FILE -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null docker-compose.yaml nginx.conf ubuntu@$EC2_IP:/home/ubuntu/personal-blog/

                        ssh -i $KEY_FILE -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ubuntu@$EC2_IP <<ENDSSH
                            set -e

                            DOCKER_USER="${DOCKERHUB_CREDENTIALS_USR}"
                            DOCKER_PASS="${DOCKERHUB_CREDENTIALS_PSW}"

                            # Ensure Docker engine and Compose v2 are available on the host.
                            sudo apt-get update
                            sudo apt-get install -y docker.io

                            if ! docker compose version >/dev/null 2>&1; then
                                sudo mkdir -p /usr/local/lib/docker/cli-plugins
                                sudo curl -SL https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
                                sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
                            fi

                            sudo systemctl enable --now docker

                            # Login once so pulls succeed when images are private.
                            echo "${DOCKER_PASS}" | sudo docker login -u "${DOCKER_USER}" --password-stdin

                            cd /home/ubuntu/personal-blog
                            sudo docker compose pull
                            sudo docker compose down --remove-orphans
                            sudo docker compose up -d
                        ENDSSH
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished'
        }
    }
}
