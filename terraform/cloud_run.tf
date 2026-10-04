resource "google_cloud_run_v2_service" "tech_digest_api" {
  name = "tech-digest-api"
  location = var.region

  deletion_protection = false

  template {
    containers {
      image = "asia-northeast1-docker.pkg.dev/${var.project_id}/tech-digest/tech-digest-api:${var.image_tag}"
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 2
    }
  }
}

resource "google_cloud_run_service_iam_member" "public_access" {
  location = google_cloud_run_v2_service.tech_digest_api.location
  service  = google_cloud_run_v2_service.tech_digest_api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
