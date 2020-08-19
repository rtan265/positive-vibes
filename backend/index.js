if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const hapi = require("@hapi/hapi");
const { MongoClient } = require("mongodb");
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const textAnalyticsClient = new TextAnalyticsClient(process.env.ENDPOINT,  new AzureKeyCredential(process.env.API_KEY));

const port = process.env.PORT || 3000;
const client = new MongoClient(process.env.MONGODB_CONNECTION);


async function getSentimentScore(message){
    
    const sentimentInput = [message];
    const sentimentResult = await textAnalyticsClient.analyzeSentiment(sentimentInput);

    if (sentimentResult[0].sentiment == "positive"){
        return true;
    } 
    
    return false;
}

async function run() {
    await client.connect();
    const db = client.db("moodbook");
    const moodCollection = db.collection("moodposts");

    const server = hapi.server({
        port: port,
        routes: { cors: { origin: ["*"] } }
    });

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

            const isPositive = await getSentimentScore(message);
            
            if (isPositive){
                const post = {
                    name: name,
                    message: message,
                    timestamp: new Date().getTime()
                }
    
                await moodCollection.insertOne(post);
    
                return { success: true }
            }
            
            return { success: false }
        }
    });


    await server.start();
    console.log("Server running on port: " + port);

}

run();