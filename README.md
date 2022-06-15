# hedera-test

```
npm install --save @hashgraph/sdk
npm install dotenv

node init.js
```

# Usage

Set the .env file with these fields:
```
MY_ACCOUNT_ID=_
MY_PRIVATE_KEY=_
TOPIC_ID=_
```

To verify the account and topic setup:
`node init.js`

To generate transactions:
`node generateTxs.js [NUM_TXS]`

To subscribe to the topic:
`node subscribeTopic.js`

To generate transactions with multiple clients:
`runTxTest.sh NUM_PROCESSES NUM_TRANSACTION_PER_PROCESS`