# CLI

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
* `--env, -e <env>` - environment [main,ropsten,rinkeby,kovan,sokol,xdai,local] (default: main)
* `--local-env-host <host>` - local environment host
* `--local-env-port <port>` - local environment port
* `--private-key <key>` - device private key
