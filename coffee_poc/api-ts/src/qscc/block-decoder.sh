#!/bin/sh
echo ${PWD}

${PWD}/configtxlator proto_decode --input ${PWD}/data/blockData.block --type common.Block > block.json