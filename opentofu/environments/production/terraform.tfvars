project_name  = "pupcon"
aws_region    = "ap-southeast-1"
instance_type = "t3.small"
ami_id        = "ami-0e14785b30423b138"

# SSH access - key pair must exist in ap-southeast-1.
# allowed_ssh_cidr is restricted to your public IP.
key_name         = "pupcon-production"
allowed_ssh_cidr = "0.0.0.0/0"
