import "reflect-metadata";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Express } from "express";
import { initializeDatabase } from "../config/db";
import router from "./routes/authRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

initializeDatabase();

const app: Express = express();
const port = process.env.PORT || 3000;


// TODO: implement a better way to document the endpoints of the API ( Swagger, etc. )
const endpoints = 
    [
        { "method": "POST", "path": "/auth/login" },
        { "method": "POST", "path": "/auth/register" },
        { "method": "POST", "path": "/auth/logout" },
        { "method": "GET", "path": "/users/profile" },
        { "method": "POST", "path": "/users/add-endeks" },
        { "method": "POST", "path": "/users/delete-endeks" },
        { "method": "GET", "path": "/users/endekses" },
        { "method": "GET", "path": "/users/consumptions" }
      ]
    
app.use(bodyParser.json());


app.use(router);
app.use(authRoutes);


app.get('/', (req, res) => {
    res.json(endpoints);
  });

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
