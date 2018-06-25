#!/bin/bash

echo 'ACT ...'
node src/index.js 'samples/ACT/201718-ACT-NT-SA-WA-Price-Guide-30Oct.csv' 'samples/ACT/201819-ACT-NT-SA-WA-Price-Guide.csv' 'samples/ACT'

echo 'NSW...'
node src/index.js 'samples/NSW/201718-VIC-NSW-QLD-TAS-Price-Guide-30Oct.csv' 'samples/NSW/201819-VIC-NSW-QLD-TAS-Price-Guide.csv' 'samples/NSW'

echo 'Remote...'
node src/index.js 'samples/Remote/201718-Remote-Price-Guide-30Oct.csv' 'samples/Remote/201819-Remote-Price-Guide.csv' 'samples/Remote'

echo 'Very remote...'
node src/index.js 'samples/Very-remote/201718-VeryRemote-Price-Guide-30Oct.csv' 'samples/Very-remote/201819-Very-Remote-Price-Guide.csv' 'samples/Very-remote'

exit 0
