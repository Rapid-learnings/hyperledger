#!/bin/sh

echo 'enter peer name'
read ID

sudo docker rm $ID

echo "Successfully removed $ID"