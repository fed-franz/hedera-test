const {
    TopicMessageQuery,
    TopicId,
} = require("@hashgraph/sdk");

require("dotenv").config();

const {printTime} = require('./utils');
const {connectClient} = require('./lib-hedera');

/*******************************************/

async function main() {

    /* Process .env */
    const accountId = process.env.ACCOUNT_ID;
    const privateKey = process.env.PRIVATE_KEY;
    topicNumber = process.env.TOPIC_NUM;

    // Assert Account
    if (accountId == null ||
        privateKey == null ) {
            throw new Error("Please set ACCOUNT_ID and PRIVATE_KEY in the .env file");
    }
    
    /* Process arguments */
    const psArgs = process.argv.slice(2);
    TOPIC_NUM = null
    if (psArgs.length > 0)
        TOPIC_NUM = psArgs[0];

    // Set topic ID
    // Give priority to argument over .env
    if(TOPIC_NUM != null)
        topicNumber = TOPIC_NUM;
    
    // Assert topic
    if(topicNumber == null)
        throw new Error("Please provide topic number or set 'TOPIC_NUM' in the .env file");

    topicId = TopicId.fromString(topicNumber);
    console.log("Setting topic to "+topicId);
    
    ///////////////////////////////////////////////////////////////////


    // Connect to Hedera
    const client = await connectClient(accountId, privateKey)

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