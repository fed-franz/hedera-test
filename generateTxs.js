const {
    TopicMessageSubmitTransaction,
    TopicId
} = require("@hashgraph/sdk");

require("dotenv").config();

const {printTime, sleep} = require('./utils');
const {connectClient} = require('./lib-hedera');

NUM_MSGS=10

async function main() {

    /* Process arguments */
    const psArgs = process.argv.slice(2);
    if (psArgs.length > 0)
        NUM_MSGS = psArgs[0];
    TOPIC_NUM = null
    if (psArgs.length > 1)
        TOPIC_NUM = psArgs[1];

    //Load Hedera account ID and private key from .env
    const accountId = process.env.ACCOUNT_ID;
    const privateKey = process.env.PRIVATE_KEY;

    // Assert Account
    if (accountId == null ||
        privateKey == null ) {
        throw new Error("Please set ACCOUNT_ID and PRIVATE_KEY in the .env file");
    }

    // Set topic ID
    let topicNumber = null;
    if(TOPIC_NUM != null)
        topicNumber = TOPIC_NUM;
    else if (process.env.TOPIC_NUM != null) {
        topicNumber = process.env.TOPIC_NUM
    }

    // If not provided, let's create a new topic
    if(topicNumber != null)
        topicId = TopicId.fromString(topicNumber);
    else {
        console.log("Creating new topic");
        topicId = await createTopic(client);
        // Wait 5 seconds between consensus topic creation and subscription 
        await sleep(5000);
    }

    console.log("Setting topic to "+topicId);

    /* Change maxNodesPerTransaction */
    // client.setMaxNodesPerTransaction(1);
    // console.log("Max Nodes per Transaction: " + client.maxNodesPerTransaction);

    ///////////////////////////////////////////////////////////////////

    // Connect to Hedera
    const client = await connectClient(accountId, privateKey)
    
    /* Send Transactions */
    console.log("Sending "+NUM_MSGS+" transactions to topic "+topicNumber)
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

    /* Wrap Up */
    console.log("<-------->")
    printTime();
}

main();