variable "project_name" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "instance_type" {
  type = string
}

variable "ami_id" {
  type        = string
  description = "Pinned Debian 12 AMI ID for the EC2 instance"
}
