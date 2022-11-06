require "kemal"
require "db"
require "sqlite3"
require "pg"
require "hashids"

hashids = Hashids.new(salt: ENV["OBSERVABLE_SALT"], min_hash_size: 4)

DB.open(ENV["DB_URL"]) do |db|
  serve_static false

  error 404 do |env|
    "Unknown path #{env.request.path}"
  end

  before_all do |env|
    env.response.headers["Access-Control-Allow-Origin"] = ENV["ALLOWED_ORIGINS"]
  end

  get "/get/:id" do |env|
    hash = env.params.url["id"]
    begin
      id = hashids.decode(hash)[0]
      contents = db.query_one "select contents from profiles where id=$1", id, as: Bytes
      env.response.content_type = "application/json"
      env.response.headers["Content-Encoding"] = "gzip"
      env.response.write(contents)
    rescue DB::NoResultsError
      env.response.status_code = 404
    end
  end

  post "/add" do |env|
    body = env.request.body
    if body
      id = db.query_one "insert into profiles (contents) values ($1) returning id", body.getb_to_end, as: Int32
      hash = hashids.encode [id]
      "https://o.tas.sh/\##{hash}"
    end
  end

  Kemal.run 8080
end
