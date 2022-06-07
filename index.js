const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sbssx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const itemsCollection = client.db("pcHouse").collection("items");
    const myItemsCollection = client.db("pcHouse").collection("myItems");
    app.get("/items", async (req, res) => {
      const query = {};
      const cursor = itemsCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });

    app.get("/items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const items = await itemsCollection.findOne(query);
      res.send(items);
    });

    // DELETE ITEM
    app.delete("/items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemsCollection.deleteOne(query);
      res.send(result);
    });

    // ADD NEW ITEM
    app.post("/myItems", async (req, res) => {
      const newItem = req.body;
      const result = await myItemsCollection.insertOne(newItem);
      res.send(result);
    });

    // put MyItems
    app.put(`/myItems/:email`, async (req, res) => {
      const email = req.params.email;
      const updateData = req.body;
      const filter = { email: ObjectId(email) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: updateData.newQuantity,
        },
      };

      const result = await myItemsCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });

    app.get("/myItems/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: ObjectId(email) };
      const myItems = await myItemsCollection.findOne(query);
      res.send(myItems);
    });
    // put item
    app.put(`/items/:id`, async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: updateData.newQuantity,
        },
      };
      const result = await itemsCollection.updateOne(filter, updateDoc, option);
      res.send(result);
    });
  } finally {
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`<h1>Hello PC_HOUSE SERVER WORLD</h1>`);
});

app.listen(port, () => {
  console.log("listening on port", port);
});
