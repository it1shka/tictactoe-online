#!/usr/bin/env python3

from subprocess import Popen

commands = [
  'sass --watch sass/styles.scss:static/styles.css',
  'nodemon --watch client --ext "ts" --exec tsc',
  'nodemon --ext "go" --exec go run main.go --signal SIGTERM'
]

processes = [Popen(c, shell=True) for c in commands]
for process in processes: process.wait()