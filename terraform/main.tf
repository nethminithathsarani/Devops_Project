provider "aws" {
  region = "us-east-1"
}

# Reference existing security group
data "aws_security_group" "jenkins_sg" {
  name = "jenkins-security-group"
}

# EC2 Instance for Jenkins
resource "aws_instance" "jenkins_server" {
  ami           = "ami-0fb0b230890ccd1e6"
  instance_type = "t3.micro"
  key_name      = "personal-blog-key"

  vpc_security_group_ids = [data.aws_security_group.jenkins_sg.id]

  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update
              sudo apt-get install -y docker.io
              sudo systemctl start docker
              sudo systemctl enable docker
              sudo usermod -aG docker ubuntu
              
              # Install Jenkins
              sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
                https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
              echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
                https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
                /etc/apt/sources.list.d/jenkins.list > /dev/null
              sudo apt-get update
              sudo apt-get install -y jenkins
              sudo systemctl start jenkins
              sudo systemctl enable jenkins
              EOF

  tags = {
    Name = "Jenkins-Server"
  }
}

output "jenkins_public_ip" {
  value = aws_instance.jenkins_server.public_ip
}