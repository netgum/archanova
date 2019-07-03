# Archanova SDK Playground

## Installation

```bash
$ git clone https://github.com/netgum/archanova.git
$ cd ./archanova
$ npm i
$ npm run bootstrap
$ npm run compile
```

## Usage

Starts `first` instance on `5100` port:

```bash
$ export REACT_APP_SDK_ENV=kovan
$ npm run start:sdk:playground:5100
```

Starts `second` instance on `5200` port:

```bash
$ export REACT_APP_SDK_ENV=kovan
$ npm run start:sdk:playground:5200
```

## Configuration via `env` variables

| Name 	| Default Value 	| Options 	|
| --- | ---| ---|
| `REACT_APP_SECONDARY` 	| `0` 	| `1,0` 	|
| `REACT_APP_SDK_ENV` 	| `kovan` 	| `kovan,rinkeby,ropsten,local` 	|
| `REACT_APP_SDK_LOCAL_ENV_HOST` 	| `localhost` 	| `-` |
| `REACT_APP_SDK_LOCAL_ENV_PORT` 	| `8880` 	| `-` |
| `REACT_APP_SDK_AUTO_INITIALIZE` 	| `1` 	| `0,1` |
| `REACT_APP_SDK_AUTO_ACCEPT_ACTION` 	| `1` 	| `0,1` |

## License

The MIT License
