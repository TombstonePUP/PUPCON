terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "app" {
  source = "../../modules/aws-app"

  project_name      = var.project_name
  environment       = "staging"
  aws_region        = var.aws_region
  instance_type     = var.instance_type
  ami_id            = var.ami_id
  allowed_http_cidr = "0.0.0.0/0"
  create_lock_table = true
}

output "instance_id" {
  value = module.app.instance_id
}
