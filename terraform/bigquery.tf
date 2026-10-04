resource "google_bigquery_dataset" "tech_digest" {
  dataset_id = "tech_digest"
  location = var.region

  default_table_expiration_ms = null
}

resource "google_bigquery_table" "articles" {
  dataset_id = google_bigquery_dataset.tech_digest.dataset_id
  table_id = "articles"

  schema = jsonencode([
    { name = "id", type = "STRING", mode = "REQUIRED" },
    { name = "title", type = "STRING", mode = "REQUIRED" },
    { name = "url", type = "STRING", mode = "REQUIRED" },
    { name = "summary", type = "STRING", mode = "NULLABLE" },
    { name = "category", type = "STRING", mode = "NULLABLE" },
    { name = "published_at", type = "TIMESTAMP", mode = "NULLABLE" },
    { name = "created_at", type = "TIMESTAMP", mode = "REQUIRED" },
  ])
}
