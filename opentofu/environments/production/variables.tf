variable "project_name" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "instance_type" {
  type = string
}

variable "key_name" {
  type    = string
  default = null
}

variable "allowed_ssh_cidr" {
  type    = string
  default = null
}

variable "ami_id" {
  type        = string
  description = "Pinned Debian 12 AMI ID for the EC2 instance"
}
