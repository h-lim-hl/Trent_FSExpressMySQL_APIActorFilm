const express = require("express");
const SERVER_PORT = 3000;


const app = express();


app.listen(SERVER_PORT, () => {
    console.log(`Server started listening on Port ${SERVER_PORT}`);
});
