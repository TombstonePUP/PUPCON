resource "aws_s3_bucket" "app_storage" {
  bucket = "${var.project_name}-${var.environment}-storage"
  tags = {
    Environment = var.environment
    Application = "pupcon"
    awsApplication     = "arn:aws:resource-groups:ap-southeast-1:751264013679:group/pupcon/02mlg4cdlwexs7vjssacbc6b4k"
  }
}

resource "aws_s3_bucket_public_access_block" "app_storage" {
  bucket = aws_s3_bucket.app_storage.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
