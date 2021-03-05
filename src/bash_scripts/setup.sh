#!/bin/bash

brew update
yarn
cd /elt
source Slow the F Down/bin/activate
pip install -r requirements.txt
npm i
python admin.py --help