project_name = "pupcon"
aws_region = "ap-southeast-1"
instance_type = "t3.micro"
ami_id = "REPLACE_WITH_CURRENT_AMI_ID" # Run: aws ec2 describe-instances --filters "Name=tag:Name,Values=pupcon-staging-app" --query "Reservations[0].Instances[0].ImageId" --output text
