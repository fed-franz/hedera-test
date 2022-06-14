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

async function createAccount(client) {
    
    //Create new keys
    const newAccountPrivateKey = await PrivateKey.generateED25519(); 
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    //Create a new account with 1,000 tinybar starting balance
    const newAccountTransactionResponse = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(1000))
        .execute(client);

    // Get the new account ID
    const getReceipt = await newAccountTransactionResponse.getReceipt(client);
    const newAccountId = getReceipt.accountId;

    console.log("The new account ID is: " +newAccountId);

    //Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("The new account balance is: " +accountBalance.hbars.toTinybars() +" tinybar.");

    //Create the transfer transaction
    const sendHbar = await new TransferTransaction()
        .addHbarTransfer(myAccountId, Hbar.fromTinybars(-1000))
        .addHbarTransfer(newAccountId, Hbar.fromTinybars(1000))
        .execute(client);

    //Verify the transaction reached consensus
    const transactionReceipt = await sendHbar.getReceipt(client);
    console.log("The transfer transaction from my account to the new account was: " + transactionReceipt.status.toString());
    
    //Request the cost of the query
    const queryCost = await new AccountBalanceQuery()
     .setAccountId(newAccountId)
     .getCost(client);

    console.log("The cost of query is: " +queryCost);

    //Check the new account's balance
    const getNewBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("The account balance after the transfer is: " +getNewBalance.hbars.toTinybars() +" tinybar.")
}

async function createTopic(client) {
        //Create a new topic
        let txResponse = await new TopicCreateTransaction().execute(client);

        //Get the receipt of the transaction
        let receipt = await txResponse.getReceipt(client);
    
        //Grab the new topic ID from the receipt
        let topicId = receipt.topicId;
    
        //Log the topic ID
        console.log(`Your topic ID is: ${topicId}`);
    
        // Wait 5 seconds between consensus topic creation and subscription 
        await new Promise((resolve) => setTimeout(resolve, 5000));
}

function printTime(){
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    
    // prints date & time in YYYY-MM-DD HH:MM:SS format
    console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
}

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


    ///////////////////////////////////////////////////////////////////

    topicId = TopicId.fromString("0.0.45950392");

    // Create the query to subscribe to a topic
    new TopicMessageQuery()
    .setTopicId(topicId)
    .subscribe(client, null, (message) => {
        let messageAsString = Buffer.from(message.contents, "utf8").toString();
        console.log(`${message.consensusTimestamp.toDate()} Received: ${messageAsString}`);
        printTime();
    });


    
    NUM_MSGS=500
    
    let msgs = [];
    
    /* Send Transactions */
    printTime()
    for (let i = 0; i < NUM_MSGS; i++) {
        let msg = "Tx 1." + i;
        let sendMsg = await new TopicMessageSubmitTransaction({
            topicId: topicId,
            message: msg,
        }).execute(client);
    
        msgs.push(sendMsg);

      }

    /* Get Receipts */
    // for (var i = 0; i < NUM_MSGS; i++) {
    //     //Get the receipt of the transaction
    //     const receipt = await msgs[i].getReceipt(client);

    //     //Get the status of the transaction
    //     // if (receipt.status != Status.Success)
    //     //     console.log("Transaction " + i + " FAILED");
    // }
    // printTime();

    // console.log("<-------->")
}

main();