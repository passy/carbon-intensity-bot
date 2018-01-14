#!/bin/sh

# Obviously, make this part of the real integration test suite.
curl -vv 'http://localhost:5000/carbon-intensity/us-central1/webhook' -H 'Content-Type: application/json' --data @requests/carbon_latlon.json
curl -vv 'http://localhost:5000/carbon-intensity/us-central1/webhook' -H 'Content-Type: application/json' --data @requests/carbon_zip.json

# vim: tw=0
