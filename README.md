# hedera-test

```
npm install --save @hashgraph/sdk
npm install dotenv

node index.js
```

# Usage

To verify the account and topic setup:
`node index.js`

To generate transactions:
`node generateTxs.js [NUM_TXS]`

To subscribe to the topic:
`node subscribeTopic.js`

To generate transactions with multiple clients:
`runTxTest.sh NUM_PROCESSES NUM_TRANSACTION_PER_PROCESS`