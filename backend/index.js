if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const hapi = require("@hapi/hapi");
const { MongoClient } = require("mongodb");

const port = process.env.PORT || 3000;

const client = new MongoClient(process.env.MONGODB_CONNECTION);

async function run() {
    await client.connect();
    const db = client.db("moodbook");
    const moodCollection = db.collection("moodposts");

    const server = hapi.server({
        port: port,
    });

    server.route({
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        }
    })

    server.route({
        path: "/moodposts",
        method: "GET",
        handler: async () => {
            const postCursor = moodCollection.find({});
            const posts = await postCursor.toArray();
            return posts;
        }
    });

    server.route({
        path: "/createpost",
        method: "POST",
        handler: async (request) => {
            const name = request.payload.name;
            const message = request.payload.message;
            if (typeof name !== "string" || typeof message !== "string"){
                return { success: false }
            }

            const post = {
                name: name,
                message: message,
                timestamp: new Date().getTime()
            }

            await moodCollection.insertOne(post);

            return { success: true }
        }
    });


    await server.start();
    console.log("Server running on port: " + port);

}

run();