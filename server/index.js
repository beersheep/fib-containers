const keys = require('./keys');


// Express A[pp Setup
const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({
//   extended: true
// }));
//
// Postgres client setup

const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost, 
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

// Redis Client Setup

const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
})

const redisPublisher = redisClient.duplicate();

// express route handlers
//
app.get('/', (_req, res) => {
  res.send('hi');
});

app.get('/values/all', async (_req, res) => {
  const values = await pgClient.query('select * from values');
  res.send(values.rows);
})

app.get("/values/current", async (_req, res) => {
  redisClient.hgetall("values", (_err, values) =>{
    res.send(values);
  });
})

app.post("/values", async (req , res) => {
  const index = req.body.index;

  if (parseInt(index)> 40) {
    return res.status(422).send("index too high");
  }

  redisClient.hset('values', index, 'nothing yet!');
  redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
})

app.listen(5000, _err => {
  console.log("listen")
});
