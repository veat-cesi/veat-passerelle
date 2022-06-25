import express, { Application, Request, response, Response } from "express";
import axios from "axios";
const cors = require("cors");

const app: Application = express();
const port: number = 3000;

app.options("*", cors({ origin: "*", optionsSuccessStatus: 200 }));

app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

app.get("/getHome", async (req: Request, res: Response) => {
  const allRestaurants = await axios.get(
    "http://localhost:3001/getRestaurants"
  );

  const featuredRestaurants = await axios.get(
    "http://localhost:3001/getFeaturedRestaurants"
  );

  const home = {
    featured: featuredRestaurants.data,
    restaurants: allRestaurants.data,
  };
  res.json(home);
});

app.get("/getRestaurant/:name", async (req: Request, res: Response) => {
  const restaurant = await axios.get(
    "http://localhost:3001/getRestaurantByName/"+req.params.name
  );
  res.json(restaurant.data);
});

app.listen(port, () => {
  console.log(`Veat-Passerelle listening on port ${port}`);
});
