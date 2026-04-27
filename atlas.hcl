env "local" {
  src = "file://db/schema"
  url = "sqlite://db.sqlite3?_fk=1"
  dev = "sqlite://file?mode=memory&_fk=1"

  migration {
    dir = "file://db/migrations"
  }
}
