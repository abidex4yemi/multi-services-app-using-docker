const express = require('express');
const cors = require('cors');
const redis = require('redis');
const { Pool } = require('pg');

const keys = require('./keys');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// connect to postgreSQL database
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

// log error if any
pgClient.on('error', () => {
  console.log('Lost pg connection');
});

pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch((err) => {
    console.log(err);
  });

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

app.get('/', (req, res) => {
  return res.send('App is life...');
});

app.get('/values/all', async (req, res) => {
  const { rows } = await pgClient.query('SELECT * FROM values');

  return res.send(rows);
});

app.get('/values/current', (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res) => {
  const { index } = req.body;

  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }

  redisClient.hset('values', index, 'Noting yet');

  // Notify worker about the new submitted value
  redisPublisher.publish('insert', index);

  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  return res.send({ working: true });
});

app.listen(PORT, console.log(`App runNing on port: ${PORT}`));
