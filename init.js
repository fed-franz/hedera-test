const {
    Client
} = require("@hashgraph/sdk");

require("dotenv").config();

const prompt = require('prompt-sync')();
const yesno = require('yesno');

const {setEnv} = require('./utils')
const {createTopic, createAccount} = require('./lib-hedera');


async function main() {

    //Grab your Hedera testnet account ID and private key from your .env file
    myAccountId = process.env.MY_ACCOUNT_ID;
    myPrivateKey = process.env.MY_PRIVATE_KEY;

    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null || myAccountId == '_' || myPrivateKey == null || myPrivateKey == '_' ) {
        console.log("Account ID or private key not defined.")
        myAccountId = prompt('Please insert your Hedera account ID: ');
        myPrivateKey = prompt('Please insert your Hedera private key: ');

        setEnv("MY_ACCOUNT_ID", myAccountId);
        setEnv("MY_PRIVATE_KEY", myPrivateKey);
    }

    // Create our connection to the Hedera network
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

    console.log("Hedera Nodes:");
    console.log( client.network ); //TODO: print addresses only
    console.log("Hedera Mirror:");
    console.log( client.mirrorNetwork ); 

    //Grab the topic ID from .env file, create one, or get from input
    myTopicId = process.env.TOPIC_ID;
    if (myTopicId == null || myTopicId == '_') {
        const ok = await yesno({
            question: 'TOPIC_ID not defined. Do you want to insert one?'
        });
        if (ok) 
            myTopicId = prompt('Please insert the topic ID: ');    
        else{
            const ok2 = await yesno({
                question: 'Do you want to create a new topic?'
            });
            if(ok2)
                myTopicId = await createTopic(client);
            else
                console.log("WARNING: TOPIC_ID is not defined. Please insert it in the .env file or create a new one")
                return
        }
            
        setEnv("TOPIC_ID", myTopicId);
    }

    ///////////////////////////////////////////////////////////////////

    console.log("Account ID: "+myAccountId);
    console.log("Topic ID: "+myTopicId);
}

main();