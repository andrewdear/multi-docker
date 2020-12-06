const keys = require("./keys")

// Express app setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());


//Postgress setup
const {Pool} = require("pg");

const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})

pgClient.on('connect', () => {
    pgClient
        // this will create a table called values with one field called number that will be an INT
        .query('CREATE TABLE IF NOT EXISTS values (number INT)')
        .catch((err) => console.log(err));
});

//Redis Client Setup

const redis = require("redis");

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    //if we loose a connection keep trying every 1s
    retry_strategy: () => 1000,
})

// every time you want to listen to something or publish bits to need to use a duplicate version according to the docs
const redisPublisher = redisClient.duplicate();

//Express route handlers


app.get("/", (req,res) => {
    res.send("Hi");
})

app.get("/values/all", async (req, res) => {
    const values = await pgClient.query("SELECT * from values");

    res.send(values.rows);
})

app.get("/values/current", async (req, res) => {
    // reach into redis and look at a hash and get all of its values.
    redisClient.hgetall("values", (err, values) => {
        res.send(values);
    });
})

app.post("/values", async (req, res) => {
    const index = req.body.index;

    if(parseInt(index) > 40) {
        return res.status(422).send("Index too high");
    }

    // when we set the values the worker will pick it up
    redisClient.hset("values", index, "Nothing yet!");

    redisPublisher.publish("insert", index);

    pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

    res.send({working: true});
});


app.listen(5000, err => {
    console.log("listening");

})




