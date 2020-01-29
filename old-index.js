const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


// https://shrouded-reef-72972.herokuapp.com/events
app.get('/events', async (request, response) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM events');
    const results = {'events': (result) ? result.rows : null};
    response.status(200).json(results);
    client.release();
  } catch (error) {
    console.error(error);
    response.send("Error " + error);
  }
})


// https://shrouded-reef-72972.herokuapp.com/event?id=1
app.get('/event', async (request, response) => {
  try {
    const ident = String(request.params.id)    
    //const id = request.params.id
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM events WHERE id=$0', [ident]);
     
    const results = {'events': (result.rowCount>0) ? result.rows : null};
    
    //response.status(200).json(result.rows)
    response.status(200).json(results);
    //response.status(200).json(res) //nope
    client.release();
  } catch (error) {
    console.error(error);
    response.send("Error " + error);
  }
})


const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
} 



// https://shrouded-reef-72972.herokuapp.com
app.get('/', (request, response) => {
  //try {
    //const client = await pool.connect()
    response.status(200).json({ info: 'Node.js, Express, and Postgres API' })
    //client.release();
  //} catch (error) {
    //console.error(error);
    //response.send("Error " + error);
  //}
})

// https://shrouded-reef-72972.herokuapp.com/users
app.get('/users', async (request, response) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM test_table');
    const results = {'events': (result) ? result.rows : null};
    response.status(200).json(results)
    client.release();
  } catch (error) {
    console.error(error);
    response.send("Error " + error);
  }
})

// https://shrouded-reef-72972.herokuapp.com/users?id=1
app.get('/user', async (request, response) => {
  try {
    const id = parseInt(request.params.id)    
    const client = await pool.connect()
    const result = await client.query('SELECT name FROM test_table WHERE id = $1', [id], (error, res));
    const results = {'events': (result) ? result.rows : null};
    response.status(200).json(results.rows)
    //response.status(200).json(results)
    client.release();
  } catch (error) {
    console.error(error);
    response.send("Error " + error);
  }
})

/*
app.post('/users', async (request, response) => {
  try {
    const id = parseInt(request.params.id)   
    const { name } = request.body
    
    const client = await pool.connect()
    const result = await client.query('INSERT INTO users (name) VALUES ($1)', [name], (error, results));
    const results = {'events': (result) ? result.rows : null};
    //response.status(200).json(results.rows)
    //response.status(201).json(results)
    response.status(201).send('User added with ID: ${result.insertId}')
    
    client.release();
  } catch (error) {
    console.error(error);
    response.send("Error " + error);
  }
})
*/


app.post('/users', async (request, response) => {
  try {
    const { id, name } = request.body
    
    //const client = await pool.connect()
    //const result = await
    client.query('INSERT INTO users (id, name) VALUES ($1, $2)', [id, name], (error, results));
    //const results = {'events': (result) ? result.rows : null};
    //response.status(200).json(results.rows)
    //response.status(201).json(results)
    response.status(201).send('User added with ID: ${results.insertId}')
    
    //client.release();
  } catch (error) {
    console.error(error);
    response.send("Error " + error);
  }
})



app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
