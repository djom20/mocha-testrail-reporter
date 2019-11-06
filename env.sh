#!/bin/sh

egrep -v "(^#(.| )*)|^(\n|\r)*$" .env | while read line; do
	export "$line"
	IFS='=' read -ra VARLINE <<< "$line"
	printenv | grep ${VARLINE[0]}
done