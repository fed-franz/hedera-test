const {
    AccountBalanceQuery,
    AccountCreateTransaction,
    Client,
    Hbar,
    PrivateKey,
    TopicCreateTransaction,
    TransferTransaction,
} = require("@hashgraph/sdk");
const { sleep } = require("./utils");

/* connectClient */
exports.connectClient =
async function(accountId, privateKey){
    // Connect to the Hedera network
    const client = Client.forTestnet();
    client.setOperator(accountId, privateKey);

    return client
}

/* createAccount */
exports.createAccount = 
async function(accountId, client) {
    
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
        .addHbarTransfer(accountId, Hbar.fromTinybars(-1000))
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

exports.createTopic = 
async function(client) {
        //Create a new topic
        let txResponse = await new TopicCreateTransaction().execute(client);

        //Get the receipt of the transaction
        let receipt = await txResponse.getReceipt(client);
    
        //Grab the new topic ID from the receipt
        let topicId = receipt.topicId;
          
        return topicId;        
}