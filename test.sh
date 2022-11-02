#!/bin/sh

#Author : Sahil
#Script is below

a=0
while ["$a -t 10"]
do
    b="$a"
    while[$b -ge 0]
    do
        echo -n "$b "
        b=' expr $b - 1'
    done
    echo
    a='expr $a + 1'
done
