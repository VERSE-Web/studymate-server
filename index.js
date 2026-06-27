const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = process.env.MONGODB_URI;

// MongoDB Client
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        await client.connect();

        console.log("✅ Connected to MongoDB!");

        // Database
        const database = client.db("studyMateDB");
        const partnersCollection = database.collection("partners");

        // ==========================
        // GET ALL PARTNERS
        // ==========================
        app.get("/partners", async (req, res) => {
            const result = await partnersCollection.find().toArray();
            res.send(result);
        });

        // ==========================
        // GET SINGLE PARTNER
        // ==========================
        app.get("/partners/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await partnersCollection.findOne(query);
            res.send(result);
        });

        // ==========================
        // CREATE PARTNER
        // ==========================
        app.post("/partners", async (req, res) => {
            const partner = req.body;
            const result = await partnersCollection.insertOne(partner);
            res.send(result);
        });

        // ==========================
        // UPDATE PARTNER
        // ==========================
        app.put("/partners/:id", async (req, res) => {
            const id = req.params.id;
            const updatedPartner = req.body;

            const filter = { _id: new ObjectId(id) };

            const updatedDoc = {
                $set: updatedPartner,
            };

            const result = await partnersCollection.updateOne(filter, updatedDoc);

            res.send(result);
        });

        // ==========================
        // DELETE PARTNER
        // ==========================
        app.delete("/partners/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const result = await partnersCollection.deleteOne(query);

            res.send(result);
        });

        // Ping
        await client.db("admin").command({ ping: 1 });
        console.log("🏓 Successfully connected to MongoDB!");
    } catch (err) {
        console.error(err);
    }
}

run().catch(console.dir);

// Root Route
app.get("/", (req, res) => {
    res.send("🚀 StudyMate Server Running");
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});