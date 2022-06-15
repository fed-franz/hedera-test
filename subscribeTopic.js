const {
    AccountBalanceQuery,
    AccountCreateTransaction,
    AccountId,
    Hbar,
    PrivateKey,
    Client,
    TopicCreateTransaction,
    TopicMessageQuery,
    TopicMessageSubmitTransaction,
    TransferTransaction,
    TopicId,
    Status
} = require("@hashgraph/sdk");

require("dotenv").config();

const {printTime} = require('./utils');

/*******************************************/

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
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

    //Grab the topic ID from .env file
    const myTopicId = process.env.TOPIC_ID;
    if (myTopicId == null) {
        throw new Error("Environment variable TOPIC_ID must be present");
    }
    topicId = TopicId.fromString(myTopicId);

    ///////////////////////////////////////////////////////////////////

    // Create the query to subscribe to a topic
    new TopicMessageQuery()
    .setTopicId(topicId)
    .subscribe(client, null, (message) => {
        let messageAsString = Buffer.from(message.contents, "utf8").toString();
        console.log(`${message.consensusTimestamp.toDate()} Received: ${messageAsString}`);
        printTime();
    });

}

main();