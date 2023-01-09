#!/bin/sh

echo 'enter peer id'
read ID

sudo docker rm $ID

echo "Successfully removed $ID"