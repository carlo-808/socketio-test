# socketio-test

# Testing out socket.io with artillery

You will need to provide a `.env` file with the following keys:

- NEW_RELIC_LICENSE_KEY
- NEW_RELIC_HOST
- NEW_RELIC_LOG_LEVEL (optional)

Run this to start app:
```
npm run start-env
```

Install artillery globally
```
npm i -g artillery
```

Test with artillery config:
```
artillery run art-test.yaml
```
