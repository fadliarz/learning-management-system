terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}


provider aws {
  alias   = "lms-dev"
  profile = "lms-dev"
  region  = "ap-southeast-3"
}


module "dynamodb" {
  source = "./resources"

  providers = {
    aws = aws.lms-dev
  }
}