resource "google_service_account" "scheduler" {
  account_id   = "tech-digest-scheduler"
  display_name = "Cloud Scheduler for tech-digest ingest"
}

resource "google_cloud_run_service_iam_member" "scheduler_invoker" {
  location = google_cloud_run_v2_service.tech_digest_api.location
  service  = google_cloud_run_v2_service.tech_digest_api.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.scheduler.email}"
}

resource "google_cloud_scheduler_job" "ingest_morning" {
  name      = "tech-digest-ingest-morning"
  schedule  = "0 8 * * *"
  time_zone = "Asia/Tokyo"

  http_target {
    uri         = "${google_cloud_run_v2_service.tech_digest_api.uri}/ingest"
    http_method = "GET"

    oidc_token {
      service_account_email = google_service_account.scheduler.email
    }
  }
}

resource "google_cloud_scheduler_job" "ingest_evening" {
  name      = "tech-digest-ingest-evening"
  schedule  = "0 19 * * *"
  time_zone = "Asia/Tokyo"

  http_target {
    uri         = "${google_cloud_run_v2_service.tech_digest_api.uri}/ingest"
    http_method = "GET"

    oidc_token {
      service_account_email = google_service_account.scheduler.email
    }
  }
}
