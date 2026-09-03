resource "aws_instance" "app" {
  ami           = data.aws_ami.debian.id
  instance_type = var.instance_type

  iam_instance_profile = aws_iam_instance_profile.ec2_ssm_profile.name
  vpc_security_group_ids = [
    aws_security_group.app.id
  ]

    user_data = <<-EOF
      #!/usr/bin/env bash
      set -euo pipefail
      apt-get update -y
      apt-get install -y ca-certificates curl gnupg
      install -m 0755 -d /etc/apt/keyrings
      curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
      chmod a+r /etc/apt/keyrings/docker.gpg
      echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian bookworm stable" | tee /etc/apt/sources.list.d/docker.list
      apt-get update -y
      apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
      systemctl enable docker
      systemctl start docker
      mkdir -p /opt/apps/${var.project_name}-${var.environment}
      mkdir -p /tmp/ssm
      curl -fSL -o /tmp/ssm/amazon-ssm-agent.deb \
        "https://s3.${var.aws_region}.amazonaws.com/amazon-ssm-${var.aws_region}/latest/debian_amd64/amazon-ssm-agent.deb"
      dpkg -i /tmp/ssm/amazon-ssm-agent.deb || true
      rm -rf /tmp/ssm
      systemctl enable amazon-ssm-agent
      systemctl start amazon-ssm-agent
    EOF

  tags = {
    Name        = "${var.project_name}-${var.environment}-app"
    Environment = var.environment
    Application = "pupcon"
    awsApplication     = "arn:aws:resource-groups:ap-southeast-1:751264013679:group/pupcon/02mlg4cdlwexs7vjssacbc6b4k"
  }
}

data "aws_ami" "debian" {
  most_recent = true
  owners      = ["136693071363"] # Debian official AWS account

  filter {
    name   = "name"
    values = ["debian-12-amd64-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}
