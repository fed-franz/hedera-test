const {
    Client
} = require("@hashgraph/sdk");

require("dotenv").config();

const prompt = require('prompt-sync')();
const yesno = require('yesno');

const {setEnv} = require('./utils')
const {createTopic} = require('./lib-hedera');


async function main() {

    //Grab your Hedera testnet account ID and private key from your .env file
    accountId = process.env.ACCOUNT_ID;
    privateKey = process.env.PRIVATE_KEY;

    // If we weren't able to grab it, we should throw a new error
    if (accountId == null || accountId == '_' || privateKey == null || privateKey == '_' ) {
        console.log("Account ID or private key not defined.")
        accountId = prompt('Please insert your Hedera account ID: ');
        privateKey = prompt('Please insert your Hedera private key: ');

        setEnv("ACCOUNT_ID", accountId);
        setEnv("PRIVATE_KEY", privateKey);
    }

    // Create our connection to the Hedera network
    const client = Client.forTestnet();
    client.setOperator(accountId, privateKey);

    console.log("Hedera Nodes:");
    console.log( client.network ); //TODO: print addresses only
    console.log("Hedera Mirror:");
    console.log( client.mirrorNetwork ); 

    //Grab the topic ID from .env file, create one, or get from input
    topicId = process.env.TOPIC_NUM;
    if (topicId == null || topicId == '_') {
        const ok = await yesno({
            question: 'TOPIC_NUM not defined. Do you want to insert one?'
        });
        if (ok) 
            topicId = prompt('Please insert the topic ID: ');    
        else{
            const ok2 = await yesno({
                question: 'Do you want to create a new topic?'
            });
            if(ok2){
                topicId = await createTopic(client);                
            }
            else{
                console.log("WARNING: TOPIC_NUM is not defined. Please insert it in the .env file or create a new one");
                return
            }
        }
            
        setEnv("TOPIC_NUM", topicId);
    }

    ///////////////////////////////////////////////////////////////////

    console.log("");
    console.log("Account ID: "+accountId);
    console.log("Topic ID: "+topicId);
}

main();