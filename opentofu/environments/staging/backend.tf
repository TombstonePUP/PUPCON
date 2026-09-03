terraform {
  backend "s3" {
    bucket       = "pupcon-opentofu-state"
    key          = "staging/terraform.tfstate"
    region       = "ap-southeast-1"
    use_lockfile = true
  }
}
