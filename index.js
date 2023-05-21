const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
var cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qpcvbrd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const toyStore = client.db("toyManager").collection("toys");

    app.get("/toys", async (req, res) => {
      const result = await toyStore.find().toArray();
      res.send(result);
    });

    app.get("/all_toys", async (req, res) => {
      const limit = parseInt(req.query.limit);
      const allToy = await toyStore.find().toArray();
      if (limit === "all") {
        query = allToy.length;
      }
      const limitToy = await toyStore.find().limit(limit).toArray();
      res.send(limitToy);
    });

    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const toy = await toyStore.findOne(query);
      res.send(toy);
    });

    app.get("/usertoy", async (req, res) => {
      let query = {};
      let sortBy = {};

      if (req.query?.user) {
        query = { "seller.email": req.query.user };
      }

      if (req.query?.sort === "asc") {
        sortBy = { price: 1 };
      } else if (req.query?.sort === "desc") {
        sortBy = { price: -1 };
      } else {
        sortBy = { price: 1 };
      }

      const results = await toyStore.find(query).sort(sortBy).toArray();
      res.send(results);
    });

    app.post("/toys", async (req, res) => {
      const newToyItm = req.body;
      const result = await toyStore.insertOne(newToyItm);
      res.send(result);
    });

    app.put("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateToy = req.body;
      const setToy = {
        $set: {
          price: updateToy.price,
          quantity: updateToy.quantity,
          description: updateToy.description,
        },
      };

      const result = await toyStore.updateOne(filter, setToy, option);
      res.send(result);
    });

    app.delete("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const toy = await toyStore.deleteOne(query);
      res.send(toy);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Toy World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
