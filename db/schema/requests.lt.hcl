table "requests" {
  schema = schema.main

  column "id" {
    type           = integer
    null           = false
    auto_increment = true
  }

  column "prompt" {
    type = text
    null = false
  }

  column "status" {
    type    = text
    null    = false
    default = "pending"
  }

  column "created_at" {
    type    = text
    null    = false
    default = sql("CURRENT_TIMESTAMP")
  }

  column "updated_at" {
    type    = text
    null    = false
    default = sql("CURRENT_TIMESTAMP")
  }

  primary_key {
    columns = [column.id]
  }

  index "idx_requests_status_id" {
    columns = [column.status, column.id]
  }
}