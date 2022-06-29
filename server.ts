// @ts-ignore
import express, { Application, Request, Response } from "express";
import axios from "axios";
const cors = require("cors");
const bodyParser = require("body-parser");

const app: Application = express();
const port: number = 3000;

app.options("*", cors({ origin: "*", optionsSuccessStatus: 200 }));

app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(bodyParser.json());

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
    "http://localhost:3001/getRestaurantByName/" + req.params.name
  );
  res.json(restaurant.data);
});

app.get("/getRestaurantById/:id", async (req: Request, res: Response) => {
  const restaurant = await axios.get(
    "http://localhost:3001/getRestaurantById/" + req.params.id
  );
  res.json(restaurant.data);
});

app.post("/updateRestaurant", async (req: Request, res: Response) => {
  const response = await axios.post(
    "http://localhost:3001/updateRestaurant",
    req.body
  );
  res.send(response.data);
});

app.get(
  "/getProductsByRestaurantId/:id",
  async (req: Request, res: Response) => {
    const products = await axios.get(
      "http://localhost:3001/getProductsByRestaurantId/" + req.params.id
    );
    res.json(products.data);
  }
);

app.get("/getCategoryName/:id", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
        "http://localhost:3001/getCategoryName/"+req.params.id
    );
    res.send(response.data);
  }catch (e){
    res.send(e)
  }
})

app.post("/addCategory", async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
        "http://localhost:3001/addCategory", req.body
    );
    res.send(response.data);
  }catch (e){
    res.send(e)
  }
})

app.post("/updateCategory", async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
        "http://localhost:3001/updateCategory", req.body
    );
    res.send(response.data);
  }catch (e){
    res.send(e)
  }
})

app.post("/deleteCategory", async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
        "http://localhost:3001/deleteCategory", req.body
    );
    res.send(response.data);
  }catch (e){
    res.send(e)
  }
});

app.post("/updateMeal", async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
        "http://localhost:3001/updateMeal", req.body
    );
    res.send(response.data);
  }catch (e){
    res.send(e)
  }
});

app.post("/deleteMeal", async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
        "http://localhost:3001/deleteMeal", req.body
    );
    res.send(response.data);
  }catch (e){
    res.send(e)
  }
});

app.get("/getProductList/:id", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
        "http://localhost:3001/getProductList/"+ req.params.id
    );
    res.send(response.data);
  }catch (e){
    res.send(e)
  }
});

app.post("/addOrder", async (req: Request, res: Response) => {
  const order = await axios.post("http://localhost:3001/addOrder", req.body);
  res.json(order.data);
});

app.listen(port, () => {
  console.log(`Veat-Passerelle listening on port ${port}`);
});
