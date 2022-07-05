#!/bin/bash

source .env

#Default values
NUM_PS=1
NUM_TXS=1

USAGE="USAGE: 
        ./runTxTest.sh [-p NUM_PROCS] [-t TOPIC_NUM || -t \"TOPIC_LIST\"] [-N NUM_TXS]"

GUIDE="GUIDE:
    runTxTest can run in 'n-processes' mode or 'n-topics' mode.
    In 'n-processes' mode, NUM_PROCS processes are execute using a single topic.
    In 'n-topics' mode, one process per topic is executed.

    -p: sets the number of processes to run (default: 1)
    -t: sets TOPIC_NUM in n-processes mode, or TOPIC_LIST in n-topics mode.
        TOPIC_LIST must be a string with space-separated element, e.g.: \"0.0.1 0.0.2 0.0.3\" 
    -n: sets the number of transactions to send per process (default: 1)
    -h: prints this guide
"

# Parse arguments
while [ "$#" -gt 0 ]; do
  case "$1" in
    -p) NUM_PS="$2"; argp="true"; 
        shift 2;;
    -t) TOPICS="$2"; argt="true"; 
        shift 2;;
    -n) NUM_TXS="$2"; 
        shift 2;;

    -h) 
        echo "$USAGE"
        exit 0;;
    
    -*|*) 
        echo "ERROR: unknown option: $1" >&2; 
        echo "$USAGE"; 
        echo "Use -h for help"; 
        exit 1;;
  esac
done

# Parse TOPICS if provided
if [ ! -z ${TOPICS+x} ]; 
then 
    TOPIC_LIST=( $TOPICS )
else
    TOPIC_LIST=( $TOPIC_NUM )
fi

NUM_TOPICS=${#TOPIC_LIST[*]}

# Require at least one topic
if [ $NUM_TOPICS -eq 0 ]; then
    echo "ERROR: no topic number provided. Please use '-t' or set TOPIC_NUM in the .env file"
    echo "$USAGE"; 
    echo "Use -h for help"; 
    exit 0
fi

# If only one topic is provided, run in n-processes mode
if [ $NUM_TOPICS -eq 1 ]; then
    echo "[N-PROCESSES MODE]"
    echo "Running $NUM_PS processes ($NUM_TXS transactions each) for topic ${TOPIC_LIST[0]}"
    # node generateTxs.js $NUM_TXS ${TOPIC_LIST[0]}
    seq 1 $NUM_PS | xargs -n 1 -P 0 node generateTxs.js $NUM_TXS ${TOPIC_LIST[0]}

# Otherwise, run in n-topics mode (1 proc per topic)
else
    echo "[N-TOPICS MODE]"
    if [ "$argp" == "true" ]; then 
        echo "WARNING: ignoring -p argument"
    fi
    echo "Running $NUM_TOPICS processes ($NUM_TXS transactions each) for the following topics: ${TOPIC_LIST[@]}"
    for topic in "${TOPIC_LIST[@]}";
        do 
            echo ":"$topic; 
            node generateTxs.js $NUM_TXS $topic &
        done
fi


exit 0


if [ -z ${TOPICS+x} ]; 
then 
    echo "n-processes mode"; 

    # TOPIC_NUM must be defined
    if [ -z ${TOPIC_NUM+x} ]; 
    then

    seq 1 $NUM_PS | xargs -n 1 -P 0 node generateTxs.js $NUM_TXS $TOPIC_NUM
else 
    echo "n-topics mode";
fi

exit 0


exit 0


# seq 1 $NUM_PS | xargs -n 1 -P 0 node generateTxs.js $NUM_TXS
echo 1 2 3 | xargs -n 1 -P 0 node generateTxs.js $NUM_TXS


