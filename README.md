# Carbon Intensity

![](functions/assets/logo.png)

> A Google Assistant Action to query your current local electricity carbon intensity.

View in the [Google Assistant Directory](https://assistant.google.com/services/a/uid/00000075196ece08?hl=en-GB).

## Running locally

There's an odd limitation of the `firebase-tools` CLI that requires you to
export your configuration locally first. Otherwise you'll get some nice untyped
errors at runtime.

To do that first export your config:

```
firebase functions:config:get > functions/.runtimeconfig.json
```

Then run the local "emulator":

```
firebase serve --only functions
```

I like using `ngrok` to poke a tunnel into my NAT:

```
ngrok http 5000
```

Then point your Fulfilment link to your local endpoint which looks something
like this: https://deadbeef.ngrok.io/carbon-intensity/us-central1/webhook

## Deployment

```
cd functions
npm run deploy
```
