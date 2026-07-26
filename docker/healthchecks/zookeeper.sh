#!/bin/sh
set -e

echo 'ruok' | nc localhost 2181 | grep imok
