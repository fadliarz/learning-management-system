terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0" # Use the appropriate version for your setup
    }
  }
}


provider aws {
  alias   = "lms-dev"
  profile = "lms-dev"
  region  = "ap-southeast-3"
}


resource "aws_dynamodb_table" "attachment-table" {
  name         = var.dynamodb_attachment_table_name
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


resource "aws_dynamodb_table" "category-table" {
  name         = var.dynamodb_category_table_name
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


resource "aws_dynamodb_table" "class-table" {
  name         = var.dynamodb_class_table_name
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


resource "aws_dynamodb_table" "class-assignment-table" {
  name         = var.dynamodb_class_assignment_table_name
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


resource "aws_dynamodb_table" "course-table" {
  name         = var.dynamodb_course_table_name
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


resource "aws_dynamodb_table" "course-schedule-table" {
  name         = var.dynamodb_course_schedule_table_name
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


resource "aws_dynamodb_table" "enrollment-table" {
  name         = var.dynamodb_enrollment_table_name
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


resource "aws_dynamodb_table" "form-submission-table" {
  name         = var.dynamodb_form_submission_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "formId"
  range_key    = "submissionId"

  attribute {
    name = "formId"
    type = "S"
  }
  attribute {
    name = "submissionId"
    type = "N"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
}


resource "aws_dynamodb_table" "instructor-table" {
  name         = var.dynamodb_instructor_table_name
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


resource "aws_dynamodb_table" "lesson-table" {
  name         = var.dynamodb_lesson_table_name
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


resource "aws_dynamodb_table" "privilege-table" {
  name         = var.dynamodb_privilege_table_name
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


resource "aws_dynamodb_table" "scholarship-table" {
  name         = var.dynamodb_scholarship_table_name
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


resource "aws_dynamodb_table" "tag-table" {
  name         = var.dynamodb_tag_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  range_key    = "tagId"

  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "tagId"
    type = "N"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
}


resource "aws_dynamodb_table" "user-table" {
  name         = var.dynamodb_user_table_name
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


resource "aws_dynamodb_table" "user-assignment-table" {
  name         = var.dynamodb_user_assignment_table_name
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


resource "aws_dynamodb_table" "user-schedule-table" {
  name         = var.dynamodb_user_schedule_table_name
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


resource "aws_dynamodb_table" "video-table" {
  name         = var.dynamodb_video_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "lessonId"
  range_key    = "videoId"

  attribute {
    name = "lessonId"
    type = "N"
  }
  attribute {
    name = "videoId"
    type = "N"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
}


variable "dynamodb_attachment_table_name" {
  type    = string
  default = "ATTACHMENT_TABLE"
}

variable "dynamodb_category_table_name" {
  type    = string
  default = "CATEGORY_TABLE"
}

variable "dynamodb_class_table_name" {
  type    = string
  default = "CLASS_TABLE"
}

variable "dynamodb_class_assignment_table_name" {
  type    = string
  default = "CLASS_ASSIGNMENT_TABLE"
}

variable "dynamodb_course_table_name" {
  type    = string
  default = "COURSE_TABLE"
}

variable "dynamodb_course_schedule_table_name" {
  type    = string
  default = "COURSE_SCHEDULE_TABLE"
}

variable "dynamodb_enrollment_table_name" {
  type    = string
  default = "ENROLLMENT_TABLE"
}

variable "dynamodb_form_submission_table_name" {
  type    = string
  default = "FORM_SUBMISSION_TABLE"
}

variable "dynamodb_instructor_table_name" {
  type    = string
  default = "INSTRUCTOR_TABLE"
}

variable "dynamodb_lesson_table_name" {
  type    = string
  default = "LESSON_TABLE"
}

variable "dynamodb_privilege_table_name" {
  type    = string
  default = "PRIVILEGE_TABLE"
}

variable "dynamodb_scholarship_table_name" {
  type    = string
  default = "SCHOLARSHIP_TABLE"
}

variable "dynamodb_tag_table_name" {
  type    = string
  default = "TAG_TABLE"
}

variable "dynamodb_user_table_name" {
  type    = string
  default = "USER_TABLE"
}

variable "dynamodb_user_assignment_table_name" {
  type    = string
  default = "USER_ASSIGNMENT_TABLE"
}

variable "dynamodb_user_schedule_table_name" {
  type    = string
  default = "USER_SCHEDULE_TABLE"
}

variable "dynamodb_video_table_name" {
  type    = string
  default = "VIDEO_TABLE"
}