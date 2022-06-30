// @ts-ignore
import express, { Application, Request, Response } from "express";
import axios from "axios";
const cors = require("cors");
const bodyParser = require("body-parser");

const app: Application = express();
const port: number = 3000;

const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');

const io = socketio(server, {
  cors: {
    origin: '*'
  }
});

app.options("*", cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(bodyParser.json());

io.on('connection', (socket: any) => {

  console.log('user connected');
  // listen for incoming data msg on this newly connected socket
  socket.on('orderAcceptedByRestaurant', async function (data: any) {
    try {
      const response = await axios.get("http://localhost:3001/orderAcceptedByRestaurant", {data});
      const orders = await axios.get("http://localhost:3000/getOrderListByRestaurantId/" + data.restaurantId);
      const acceptedOrders = await axios.get("http://localhost:3000/getAcceptedOrderListByRestaurantId/" + data.restaurantId);
      socket.emit('refreshOrders', {orders: orders.data, acceptedOrders: acceptedOrders.data})
    }catch (e){
      console.log(e)
    }
  });

  socket.on('orderDeclinedByRestaurant', async function (data: any) {
    try {
      const response = await axios.get("http://localhost:3001/orderDeclinedByRestaurant", {data});
      const orders = await axios.get("http://localhost:3000/getOrderListByRestaurantId/" + data.restaurantId);
      const acceptedOrders = await axios.get("http://localhost:3000/getAcceptedOrderListByRestaurantId/" + data.restaurantId);
      socket.emit('refreshOrders', {orders: orders.data, acceptedOrders: acceptedOrders.data})
    }catch (e){
      console.log(e)
    }
  });

  socket.on('orderAcceptedByDelivery', async function (data: any) {
    try {
      const response = await axios.get("http://localhost:3001/orderAcceptedByDelivery", {data});
      socket.emit('refreshOrders')
      socket.emit('loadTakePage')
    }catch (e){
      console.log(e)
    }
  });

  socket.on('orderTookByDelivery', async function (data: any) {
    try {
      const response = await axios.get("http://localhost:3001/orderTookByDelivery", {data});
      socket.emit('loadGivePage')
    }catch (e){
      console.log(e)
    }
  });

  socket.on('orderGivenByDelivery', async function (data: any) {
    try {
      const response = await axios.get("http://localhost:3001/orderGivenByDelivery", {data});
      socket.emit('loadOrderPage')
    }catch (e){
      console.log(e)
    }
  });


  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});



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

app.post("/addMeal", async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
        "http://localhost:3001/addMeal", req.body
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

app.get("/getOrderListByRestaurantId/:id", async (req: Request, res: Response) =>{
  try {
    const response = await axios.get(
        "http://localhost:3001/getOrderListByRestaurantId/"+ req.params.id
    );
    res.send(response.data);
  }catch (e){
    res.send(e)
  }
});

app.get("/getAcceptedOrderListByRestaurantId/:id", async (req: Request, res: Response) =>{
  try {
    const response = await axios.get(
        "http://localhost:3001/getAcceptedOrderListByRestaurantId/"+ req.params.id
    );
    res.send(response.data);
  }catch (e){
    res.send(e)
  }
});

app.get("/getOrdersToDeliver", async (req: Request, res: Response) =>{
  try {
    const response = await axios.get(
        "http://localhost:3001/getOrdersToDeliver"
    );
    res.send(response.data);
  }catch (e){
    res.send(e)
  }
});

app.get("/getOrdersToDeliverName", async (req: Request, res: Response) =>{
  try {
    const response = await axios.get(
        "http://localhost:3001/getOrdersToDeliverName", req.body
    );
    res.send(response.data);
  }catch (e){
    res.send(e)
  }
});

app.get("/getOrderToTake", async (req: Request, res: Response) =>{
  try {
    const response = await axios.get(
        "http://localhost:3001/getOrderToTake", req.body
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

app.post("/acceptOrder", async (req: Request, res: Response) => {
  const order = await axios.post("http://localhost:3001/orderAcceptedByRestaurant", req.body);
  res.json(order.data);
});

app.post("/declineOrder", async (req: Request, res: Response) => {
  const order = await axios.post("http://localhost:3001/orderDeclinedByRestaurant", req.body);
  res.json(order.data);
});

app.post("/declineOrder", async (req: Request, res: Response) => {
  const order = await axios.post("http://localhost:3001/orderDeclinedByRestaurant", req.body);
  res.json(order.data);
});


app.listen(port, () => {
  console.log(`Veat-Passerelle listening on port ${port}`);
});

server.listen(3010, () => {
  console.log(`RestaurantWS listening on port ${3010}`);
});
