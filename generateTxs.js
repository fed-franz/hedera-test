const {
    Client,
    TopicMessageSubmitTransaction,
    TopicId
} = require("@hashgraph/sdk");

require("dotenv").config();

const {printTime} = require('./utils');

const prompt = require('prompt-sync')();

NUM_MSGS=10

async function main() {

    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null ||
        myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    // Create our connection to the Hedera network
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

    // Load Topic ID
    const myTopicId = process.env.TOPIC_ID;
    if (myTopicId == null) {
        throw new Error("Environment variable TOPIC_ID must be present");
    }
    topicId = TopicId.fromString(myTopicId);

    /* Change maxNodesPerTransaction */
    // client.setMaxNodesPerTransaction(1);
    // console.log("Max Nodes per Transaction: " + client.maxNodesPerTransaction);

    ///////////////////////////////////////////////////////////////////

    // Get NUM_MSGS argument
    const myArgs = process.argv.slice(2);
    if (myArgs.length > 0)
        NUM_MSGS = myArgs[0]

    
    console.log("Sending "+NUM_MSGS+" transactions to topic "+myTopicId)

    /* Send Transactions */
    let txs = [];
    printTime()
    for (let i = 0; i < NUM_MSGS; i++) {
        let msg = process.pid + " - Tx " + i;
        let sendMsg = await new TopicMessageSubmitTransaction({
            topicId: topicId,
            message: msg,
        }).execute(client);
    
        txs.push(sendMsg);

        // To stop after sending a tx, uncomment this line:
        // prompt('Enter to continue');
      }

    /* Get Receipts */
    // for (var i = 0; i < NUM_MSGS; i++) {
    //     //Get the receipt of the transaction
    //     const receipt = await txs[i].getReceipt(client);

    //     //Get the status of the transaction
    //     // if (receipt.status != Status.Success)
    //     //     console.log("Transaction " + i + " FAILED");
    // }

    console.log("<-------->")
    printTime();
}

main();