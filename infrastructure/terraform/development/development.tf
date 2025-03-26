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

resource "aws_dynamodb_table" "user-schedule-table" {
  provider     = aws.lms-dev
  name         = "USER_SCHEDULE_TABLE"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  range_key    = "scheduleId"

  attribute {
    name = "userId"
    type = "N"
  }
  attribute {
    name = "scheduleId"
    type = "N"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
}


resource "aws_dynamodb_table" "scholarship-table" {
  provider     = aws.lms-dev
  name         = "SCHOLARSHIP_TABLE"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  range_key    = "scholarshipId"

  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "scholarshipId"
    type = "N"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
}

resource "aws_dynamodb_table" "user-assignment-table" {
  provider     = aws.lms-dev
  name         = "USER_ASSIGNMENT_TABLE"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  range_key    = "assignmentId"

  attribute {
    name = "userId"
    type = "N"
  }
  attribute {
    name = "assignmentId"
    type = "N"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
}

resource "aws_dynamodb_table" "privilege-table" {
  provider     = aws.lms-dev
  name         = "PRIVILEGE_TABLE"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  range_key    = "permission"

  attribute {
    name = "userId"
    type = "N"
  }
  attribute {
    name = "permission"
    type = "S"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
}

resource "aws_dynamodb_table" "lesson-table" {
  provider     = aws.lms-dev
  name         = "LESSON_TABLE"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "courseId"
  range_key    = "lessonId"

  attribute {
    name = "courseId"
    type = "N"
  }
  attribute {
    name = "lessonId"
    type = "N"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
}

// ToDo: GSI
resource "aws_dynamodb_table" "instructor-table" {
  provider     = aws.lms-dev
  name         = "INSTRUCTOR_TABLE"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  range_key    = "classId"

  attribute {
    name = "userIId"
    type = "N"
  }
  attribute {
    name = "classId"
    type = "N"
  }

  global_secondary_index {
    name            = "classId_userId"
    hash_key        = "classId"
    range_key       = "userId"
    projection_type = "ALL"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
}

resource "aws_dynamodb_table" "enrollment-table" {
  provider     = aws.lms-dev
  name         = "ENROLLMENT_TABLE"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  range_key    = "classId"

  attribute {
    name = "userId"
    type = "N"
  }
  attribute {
    name = "classId"
    type = "N"
  }

  global_secondary_index {
    name            = "classId_userId"
    hash_key        = "classId"
    range_key       = "userId"
    projection_type = "ALL"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
}

resource "aws_dynamodb_table" "course-schedule-table" {
  provider     = aws.lms-dev
  name         = "COURSE_SCHEDULE_TABLE"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "courseId"
  range_key    = "scheduleId"

  attribute {
    name = "courseId"
    type = "N"
  }
  attribute {
    name = "scheduleId"
    type = "N"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
}

resource "aws_dynamodb_table" "course-table" {
  provider     = aws.lms-dev
  name         = "COURSE_TABLE"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  range_key    = "courseId"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "courseId"
    type = "N"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
}

resource "aws_dynamodb_table" "class-assignment-table" {
  provider     = aws.lms-dev
  name         = "CLASS_ASSIGNMENT_TABLE"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "classId"
  range_key    = "assignmentId"

  attribute {
    name = "classId"
    type = "N"
  }
  attribute {
    name = "assignmentId"
    type = "N"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
}

resource "aws_dynamodb_table" "class-table" {
  provider     = aws.lms-dev
  name         = "CLASS_TABLE"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "courseId"
  range_key    = "classId"

  attribute {
    name = "courseId"
    type = "N"
  }
  attribute {
    name = "classId"
    type = "N"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
}

resource "aws_dynamodb_table" "category-table" {
  provider     = aws.lms-dev
  name         = "CATEGORY_TABLE"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  range_key    = "categoryId"

  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "categoryId"
    type = "N"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
}

resource "aws_dynamodb_table" "attachment-table" {
  provider     = aws.lms-dev
  name         = "ATTACHMENT_TABLE"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "lessonId"
  range_key    = "attachmentId"

  attribute {
    name = "lessonId"
    type = "N"
  }
  attribute {
    name = "attachmentId"
    type = "N"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
}

resource "aws_dynamodb_table" "user-table" {
  provider     = aws.lms-dev
  name         = "USER_TABLE"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  range_key    = "userId"

  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "userId"
    type = "N"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
}