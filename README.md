# Hedera transaction test

```
npm install --save @hashgraph/sdk
npm install dotenv

cp .env.sample .env
node init.js
```

# Usage

Set these fields in the .env file:
```
MY_ACCOUNT_ID=_
MY_PRIVATE_KEY=_
TOPIC_ID=_
```

To setup or verify the account and topic setup:

`node init.js`

To generate transactions:

`node generateTxs.js [NUM_TXS]`

To subscribe to the topic:

`node subscribeTopic.js`

To generate transactions with multiple clients:

`runTxTest.sh NUM_PROCESSES NUM_TRANSACTION_PER_PROCESS`