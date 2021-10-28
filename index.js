const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjecId = require('mongodb').ObjectId;
const { query } = require('express');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3zfz5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {

        await client.connect();
        const database = client.db("volunteer-network");
        const volunteersCollection = database.collection("volunteers");



        //Api POST
        app.post('/volunteers', async (req, res) => {
            const volunteer = req.body

            const result = await volunteersCollection.insertOne(volunteer);
            console.log(result);
            res.json(result)
        })

        //API GET

        app.get('/volunteers', async (req, res) => {

            const cursor = volunteersCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })


        //API GET A ITEM
        app.get('/volunteers/:id', async (req, res) => {

            const id = req.params.id
            const query = { _id: ObjecId(id) }
            const result = await volunteersCollection.findOne(query)
            res.json(result)
        })





    }
    finally {
        // await client.close();
    }

}

run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("This is Volunteer Network Server")
})

app.listen(port, () => {
    console.log('Listening the port', port);
})