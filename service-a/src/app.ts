import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import dataRouter from "./routes/data";

createConnection().then(() => {
  const app = express();

  app.use(express.json());
  app.use("/api", dataRouter);

  app.listen(3000, () => {
    console.log("Service A running on http://localhost:3000");
  });
}).catch(error => console.log(error));
