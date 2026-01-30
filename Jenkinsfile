pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-login')
        AWS_CREDENTIALS = credentials('aws-creds')
        IMAGE_NAME = 'nethmini12/personal-blog'
        GIT_REPO_URL = 'https://github.com/nethminithathsarani/Devops_Project.git'
        GIT_BRANCH = 'main'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: "${GIT_BRANCH}", url: "${GIT_REPO_URL}"
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Login to Docker Hub') {
            steps {
                sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh "docker push ${IMAGE_NAME}:latest"
            }
        }

        stage('Terraform Init') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'aws-creds', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh "cd terraform && terraform init"
                }
            }
        }

        stage('Terraform Plan') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'aws-creds', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh "cd terraform && terraform plan -out=tfplan"
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'aws-creds', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh "cd terraform && terraform apply -auto-approve tfplan"
                }
            }
        }

        stage('Deploy (Optional)') {
            steps {
                withCredentials([file(credentialsId: 'ec2-ssh-key', variable: 'KEY_FILE')]) {
                    sh '''
                        cd terraform
                        EC2_IP=$(terraform output -raw jenkins_public_ip)
                        echo "Deploying to EC2 at $EC2_IP"
                        
                        ssh -i $KEY_FILE \
                            -o StrictHostKeyChecking=no \
                            -o UserKnownHostsFile=/dev/null \
                            ubuntu@$EC2_IP << 'ENDSSH'
                        
                        # Install Docker if not present
                        if ! command -v docker &> /dev/null; then
                            sudo apt-get update
                            sudo apt-get install -y docker.io
                            sudo usermod -aG docker ubuntu
                        fi
                        
                        # Pull latest image
                        docker pull nethmini12/personal-blog:latest
                        
                        # Stop and remove old container
                        docker stop personal-blog || true
                        docker rm personal-blog || true
                        
                        # Run new container
                        docker run -d --name personal-blog -p 80:3000 nethmini12/personal-blog:latest
                        
                        echo "Deployment complete!"
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
