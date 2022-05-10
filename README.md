# vybe.ch

## Development

### Prerequisites

- [Node v12.x.x][node-download-url]
- [Yarn v1.17.x][yarn-download-url]

### Install, Build & Watch

If you're setting up the project for the first time:

```
yarn install && yarn build && yarn setup
```

After that you can watch the project via (in two different shells):

```
docker-compose up mongo 
yarn watch
```


The following servers will be available:

- **Wepublish API:** [http://localhost:4000](http://localhost:4000)
- **Editor:** [http://localhost:3000](http://localhost:3000)
- **Editor:** [http://localhost:3000](http://localhost:3000)
- **Media Server** [http://localhost:3004](http://localhost:3004)


### Bump to new WEP version

1) Change version of packages ```@wepublish/api```, ```@wepublish/api-db-mongodb``` and ```@wepublish/api-media-karma``` in ```api/package.json``` to mew WEP version.
2) Change version of packages ```@wepublish/editor``` in ```editor/package.json``` to new WEP version.
3) Run in root  ```yarn install```
4) If necessary fix ```api/src/index.ts``` until ```yarn build``` command works again
5) Push to main for deployment
