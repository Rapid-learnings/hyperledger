#!/bin/sh

# export PATH=${PWD}/bin:$PATH
# export FABRIC_CFG_PATH=${PWD}/config

${PWD}/configtxlator proto_decode --input ${PWD}/data/transactionData.block --type protos.ProcessedTransaction > transaction.json