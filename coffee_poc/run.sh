# this file will run all the subsequent shell scripts

./network.sh

sleep 5

./startdocker.sh

sleep 5

./deployCC.sh

sleep 5

./mfdPrd.sh

sleep 5

./mfcWhs.sh

sleep 5

./whsRtlr.sh