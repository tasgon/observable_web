require "kemal"
require "db"
require "sqlite3"
require "pg"
require "redis"

redis = Redis.new(host: ENV["REDIS_HOST"], port: 6379)

def incr_view_from(src : Socket::Address | Nil, redis : Redis)
  addr = src.try &.as(Socket::IPAddress)
  if addr
    tag = "e#{addr.address}"
    if redis.get(tag) == nil
      puts "Recording view from #{addr.address}:#{addr.port}"
      redis.setex tag, 600, "1"
      redis.incr "views"
    end
  end
end

DB.open(ENV["DB_URL"]) do |db|
  serve_static false

  error 404 do
    "Unknown path"
  end

  get "/info" do |env|
    env.response.content_type = "application/json"
    incr_view_from(env.request.remote_address, redis)
    {
      "views": redis.get("views").try &.to_i || 0,
      "profiles": redis.get("profiles").try &.to_i || 0
    }.to_json
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
      redis.incr("views")
      response.to_s
    rescue DB::NoResultsError
      env.response.status_code = 404
    end
  end

  post "/add" do |env|
    body = env.request.body
    if body
      redis.incr("profiles")
      id = Random::Secure.urlsafe_base64(4)
      db.exec "insert into profiles values (?, ?)", id, body.gets_to_end
      id
    end
  end

  get "/" do |env|
    env.redirect "https://o.tas.sh/"
  end

  Kemal.run 8080
end
