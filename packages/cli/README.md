# Archanova CLI

[![NPM version][npm-image]][npm-url]

## Installation

```bash
$ npm i @archanova/cli -g
```

## Usage

```bash
$ archanova-cli [action] [options] [workingPath]
```

**Actions:**
* `auth` - authentication
* `init` - initialize application
* `develop` - develop application
* `deploy` - deploy application

**Options:**
* `--help, -h` - print help
* `--global, -g` - use global storage
* `--env, -e <env>` - environment [ropsten,rinkeby,kovan,local] (default: kovan)
* `--local-env-host <host>` - local environment host
* `--local-env-port <port>` - local environment port
* `--private-key <key>` - device private key


## License

The MIT License

[npm-image]: https://badge.fury.io/js/%40archanova%2Fcli.svg
[npm-url]: https://npmjs.org/package/@archanova/cli
