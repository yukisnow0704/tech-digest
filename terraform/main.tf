terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "~> 6.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region = var.region
}

variable "project_id" {
  default     = "tech-digest-prod"
}

variable "region" {
  default     = "asia-northeast1"
}
