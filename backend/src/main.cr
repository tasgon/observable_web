require "kemal"
require "db"
require "sqlite3"
require "pg"
require "redis"
require "hashids"

hashids = Hashids.new(salt: "Observable salt", min_hash_size: 4)
redis = Redis.new(host: ENV["REDIS_HOST"], port: 6379)

def incr_view_from(env : HTTP::Server::Context, redis : Redis)
  src = env.request.remote_address
  addr = src.try &.as Socket::IPAddress
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
    incr_view_from(env, redis)
    {
      "views": redis.get("views").try &.to_i || 0,
      "profiles": redis.get("profiles").try &.to_i || 0
    }.to_json
  end

  get "/get/:id" do |env|
    hash = env.params.url["id"]
    begin
      id = hashids.decode(hash)[0]
      puts "id: #{id}"
      contents = db.query_one "select contents from profiles where id=$1", id, as: Bytes
      env.response.content_type = "application/json"
      env.response.headers["Content-Encoding"] = "gzip"
      incr_view_from(env, redis)
      # puts "contents: #{contents}"
      env.response.write(contents)
    rescue DB::NoResultsError
      env.response.status_code = 404
    end
  end

  post "/add" do |env|
    body = env.request.body
    if body
      redis.incr("profiles")
      id = db.query_one "insert into profiles (contents) values ($1) returning id", body.getb_to_end, as: Int32
      puts "last id: #{id}"
      hash = hashids.encode [id]
      "https://o.tas.sh/\##{hash}"
    end
  end

  get "/" do |env|
    env.redirect "https://o.tas.sh/"
  end

  Kemal.run 8080
end
