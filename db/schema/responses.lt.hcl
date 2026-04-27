table "responses" {
  schema = schema.main

  column "id" {
    type           = integer
    null           = false
    auto_increment = true
  }

  column "request_id" {
    type = integer
    null = false
  }

  column "events" {
    type    = text
    null    = false
    default = "[]"
  }

  column "result" {
    type = text
    null = true
  }

  column "error_message" {
    type = text
    null = true
  }

  column "error_stack" {
    type = text
    null = true
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

  foreign_key "fk_responses_requests" {
    columns     = [column.request_id]
    ref_columns = [table.requests.column.id]
    on_delete   = CASCADE
    on_update   = CASCADE
  }

  index "uq_responses_request_id" {
    columns = [column.request_id]
    unique  = true
  }
}
