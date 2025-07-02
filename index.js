const express = require("express");
const mysql = require("mysql2/promise");

const SERVER_PORT = 3000;

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "mariadb",
    database: "sakila",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0, // 0 means infinite queue
});

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.status(418).json({
        "message": "I'm a teapot!"
    });
});

app.get("/api/", (req, res) => {
   res.status(200).json({"message": "api online"}); 
});


app.get("/api/actor/", async (req, res) => {
    // const { id, firstname, lastname } = req.query;
    try {
        const result = await pool.query("SELECT * FROM actor");
        res.status(200).json({result});
    } catch (err) {
        console.error(err);
        res.status(500).json({"error": err});
    }
});

app.post("/actor", async (req, res) => {
    const {first_name, last_name } = res.body;
    if(!first_name || !last_name) { 
        res.status(400).json({"error" : "Bad Request body"});
        return;
    };

    const connection = await pool.getConnection();
    try {
        connection.beginTransaction();
        let newActorId = await connection.query(`INSERT INTO actor (first_name, last_name) VALUES (? , ?);`, [first_name, last_name]);
        connection.commit();
        res.status(200).json({"newId" : newActorId});
    }
    catch (err) {
        connection.rollback();
        console.error(err);
        res.status(500).json({"error": err});
    }
    finally {
        connection.release();
    }
});

app.put('/api/actor/:id', async (req, res) => {
    const targetId = req.params.id;
    const {first_name, last_name} = req.body;
    if(!targetId || !first_name || !last_name){
        res.status(400).json({"error" : "Bad Data"});
        return;
    }
    const connection = await pool.getConnection();
    try{
        connection.beginTransaction();        
    }

    
});

app.listen(SERVER_PORT, () => {
    console.log(`Server started listening on Port ${SERVER_PORT}`);
});
