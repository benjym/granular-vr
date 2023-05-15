#!/bin/zsh

# run with ./make_audio.sh INPUT_FILE.json OUTPUT_FILE.mp3

# on laptop
# export GOOGLE_APPLICATION_CREDENTIALS=~/Dropbox/Research/Codes/mapping-toolbox-e208680474e5.json
# on work imac
export GOOGLE_APPLICATION_CREDENTIALS=mapping-toolbox-da997278d719.json

curl -X POST \
    -H "Authorization: Bearer $(gcloud auth application-default print-access-token)" \
    -H "Content-Type: application/json; charset=utf-8" \
    -d @$1 \
    "https://texttospeech.googleapis.com/v1/text:synthesize" | \

python3 -c "import sys, json; print(json.load(sys.stdin)['audioContent'])" | \

base64 --decode -o $2