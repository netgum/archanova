import React from 'react';
import { Box } from 'ink';
import chalk from 'chalk';
import { ContextComponent } from '../context';
import { Actions } from '../constants';

const HELP_OPTIONS = chalk`
{magenta Options}
  {cyan --help, -h              } print help
  {cyan --global, -g            } use global scope
  {cyan --env, -e <env>         } environment [main,ropsten,rinkeby,kovan,sokol,xdai,local] (default: main)
  {cyan --local-env-host <host> } local environment host
  {cyan --local-env-port <port> } local environment port
  {cyan --private-key <key>     } device private key`;

const defaultHelp = chalk`
{magenta Usage} {cyan archanova-cli} [action] [options] [workingPath]

${chalk.magenta('Actions')}
  {cyan ${Actions.Auth}}     authentication
  {cyan ${Actions.Init}}     initialize application
  {cyan ${Actions.Develop}}  develop application
  {cyan ${Actions.Deploy}}   deploy application
${HELP_OPTIONS}
`;

function buildActionHelp(action: Actions): string {
  return chalk`
{magenta Usage} {cyan archanova-cli} {cyanBright ${action}} [options] [workingPath]
${HELP_OPTIONS}
`;
}

export class Help extends ContextComponent {
  public render(): any {
    const { config: { action } } = this.context;
    let help: string = null;

    if (!action) {
      help = defaultHelp;
    } else {
      help = buildActionHelp(action);
    }

    return (
      <Box>
        {help.trim()}
      </Box>
    );
  }
}
