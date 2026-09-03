output "instance_id" {
  value = aws_instance.app.id
}

output "instance_public_ip" {
  value = aws_instance.app.public_ip
}

output "s3_bucket_name" {
  value = aws_s3_bucket.app_storage.bucket
}
