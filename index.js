const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

//midalware
app.use(cors());
app.use(express.json());

//port
const port = process.env.PORT || 3000;
const uri = "mongodb+srv://Ibrahim:12345514@ibrahim.a2p60n2.mongodb.net/?retryWrites=true&w=majority";


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const todoCollection = client.db("TasksDb").collection("Todo");
        const pogressColluction = client.db("TasksDb").collection("pogress");
        // const completeColluction = client.db("TodoDb").collection("Complete");

        //get all data
        app.get('/', async (req, res) => {
            const tasks = await todoCollection.find().toArray();
            res.send(tasks);
        })

        //post data
        app.post('/task', async (req, res) => {
            const data = req.body;

            const result = await todoCollection.insertOne(data);
            res.send(result);
        });
        app.patch('/move/:status', async (req, res) => {
            const data = req.body.selectedData.map(id => new ObjectId(id));
            const newStatus = req.params.status;
            const filter = {
                _id: {
                    $in: data
                }
            }
            const Update = { $set: { status: newStatus } };

            try {
                const result = await todoCollection.updateMany(filter, Update)
                console.log(`${result.modifiedCount} successfully updated`);

                res.status(200).send({ message: 'Status updated successfully.', resulte: result });
            } catch (error) {
                res.status(500).send({ message: 'Error updating status.', error });


            }
        });
        app.delete('/delete', async (req, res) => {
            const data = req.body.selectedData.map(id => new ObjectId(id));
            const filter = {
                _id: {
                    $in: data
                }
            }

            try {
                const result = await todoCollection.deleteMany(filter)
                console.log(`${result.modifiedCount} successfully updated`);
                res.status(200).send({ message: 'Status updated successfully.', resulte: result });
            } catch (error) {
                res.status(500).send({ message: 'Error updating status.', error });


            }
        });

        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Todo task app listening ${port}`)
})
