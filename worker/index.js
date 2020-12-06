const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000,
})

const sub = redisClient.duplicate();

function fib(index) {
    // this is deliberatly the slow version. It is to give and example of when a worker could be used.
    if(index < 2) return index;

    return fib(index - 1) + fib(index - 2);
}

sub.on("message", (channel, message) => {
    // every time we get a message we will set into a hash called values under the key message with the the fib value
    redisClient.hset("values", message, fib(parseInt(message)));
})

// this subscribes the sub to the insert of any data into redis
sub.subscribe("insert");