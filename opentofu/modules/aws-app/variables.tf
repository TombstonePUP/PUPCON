variable "environment" {
  type = string
  description = "The environment to deploy to (e.g., dev, staging, prod)"
}

variable "project_name" {
  type = string
  description = "The name of the project"
}

variable "aws_region" {
  type = string
  description = "The AWS region to deploy resources in"
}

variable "instance_type" {
  type = string
  description = "The EC2 instance type to use for the application servers"
}

variable "key_name" {
  type = string
  description = "The name of the SSH key pair to use for EC2 instances"
  default = null
}

variable "allowed_http_cidr" {
  type = string
  description = "The CIDR block to allow HTTP access from (e.g.,"
  default = "0.0.0.0/0"
}

variable "allowed_ssh_cidr" {
  type = string
  description = "The CIDR block to allow SSH access from (e.g., your IP address)"
  default = null
}

variable "create_lock_table" {
  type    = bool
  description = "Whether to create the shared OpenTofu state-lock DynamoDB table. Enable in exactly one environment (e.g., staging)."
  default = false
}
