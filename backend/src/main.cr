require "kemal"
require "db"
require "sqlite3"

db = DB.open "sqlite3://./data.db" do |db|
  # db.exec "create table profiles (id text, contents text)"

  serve_static false

  error 404 do
    "Unknown path"
  end

  get "/" do |env|
    "Observable server #{`(git show-ref refs/heads/master --hash)`}"
  end

  get "/get/:id" do |env|
    id = env.params.url["id"]
    begin
      contents = db.query_one "select contents from profiles where id=?", id, as: String
      env.response.content_type = "application/json"
      env.response.headers["Content-Encoding"] = "gzip"
      response = IO::Memory.new(2048)
      Compress::Gzip::Writer.open(response) do |gzip|
        gzip.write(contents.to_slice)
      end
      response.to_s
    rescue DB::NoResultsError
      env.response.status_code = 404
    end
  end

  post "/add" do |env|
    body = env.request.body
    if body
      id = Random::Secure.urlsafe_base64(4)
      db.exec "insert into profiles values (?, ?)", id, body.gets_to_end
      id
    end
  end

  Kemal.run 8080
end
