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
