require("dotenv").config();

const {
    Client
} = require("@hashgraph/sdk");


const prompt = require('prompt-sync')();
const yesno = require('yesno');

const {setEnv} = require('./utils')
const {connectClient, createTopic} = require('./lib-hedera');

/**************************************************************/
async function main() {

    /* Process .env */
    const accountId = process.env.ACCOUNT_ID;
    const privateKey = process.env.PRIVATE_KEY;
    
    // If we weren't able to grab it, we should throw a new error
    if (accountId == null ||
        privateKey == null ) {
            throw new Error("Please set ACCOUNT_ID and PRIVATE_KEY in the .env file");
    }
    
    ///////////////////////////////////////////////////////////////////

    // Connect to Hedera
    const client = await connectClient(accountId, privateKey)

    newTopicId = await createTopic(client);

    console.log("New Topic ID created: " + newTopicId);

    const ok = await yesno({
        question: 'Do you want to set it in the .env file?'
    });
    if (ok) 
        setEnv("TOPIC_NUM", newTopicId);

    return
}

main();