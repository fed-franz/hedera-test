#!/bin/bash

NUM_PS=$1
NUM_TX_PER_PS=$2

seq 1 $NUM_PS | xargs -n 1 -P 0 node generateTxs.js $NUM_TX_PER_PS
