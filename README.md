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
ACCOUNT_ID=_
PRIVATE_KEY=_
TOPIC_NUM=_
```

To setup or verify the account and topic setup:

`node init.js`

To generate transactions:

`node generateTxs.js [NUM_TXS] [TOPIC_NUM]`

To subscribe to the topic:

`node subscribeTopic.js [TOPIC_NUM]`

To generate transactions with multiple clients:

`./runTxTest.sh [-p NUM_PROCS] [-t TOPIC_ID || -t \"TOPIC_LIST\"] [-N NUM_TXS]"`

For more help using `runTxTest` use `./runTxTest.sh -h`