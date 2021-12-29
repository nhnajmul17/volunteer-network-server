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
        const eventsCollection = database.collection("events");

        //add a event
        app.post('/addevents', async (req, res) => {
            const event = req.body
            const result = await eventsCollection.insertOne(event)
            res.json(result)
        })

        //get all events
        app.get('/events', async (req, res) => {
            const cursor = eventsCollection.find({})
            const result = await cursor.toArray()
            res.json(result)

        })
        //get event by search
        app.get("/searchEvent", async (req, res) => {
            const result = await eventsCollection.find({
                title: { $regex: req.query.search },
            }).toArray();
            res.send(result);
            console.log(result);
        });


        //delete an event
        app.delete('/deleteEvent/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjecId(id) };
            const result = await eventsCollection.deleteOne(query);
            res.send(result)
        })

        //add a volunteer
        app.post('/volunteers', async (req, res) => {
            const volunteer = req.body

            const result = await volunteersCollection.insertOne(volunteer);
            console.log(result);
            res.json(result)
        })

        // GET all volunteer

        app.get('/volunteers', async (req, res) => {

            const cursor = volunteersCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })


        //API GET A volunteer
        app.get('/volunteers/:id', async (req, res) => {

            const id = req.params.id
            const query = { _id: ObjecId(id) }
            const result = await volunteersCollection.findOne(query)
            res.json(result)
        })
        //delete a volunteer
        app.delete('/deleteVolunteer/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjecId(id) };
            const result = await volunteersCollection.deleteOne(query);
            res.send(result)
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