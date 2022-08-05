#!/usr/bin/env node

/**
 * Functions:
 *   async md5
 *   async getMimeType
 *   async recurseDirectory
 *   media predicate
 */
import yargs from 'yargs';

import { acceptFile, getFiles } from './utils';

const parser = yargs(process.argv.slice(2))
  .scriptName('media-mover')
  .usage('Usage: $0 <options>')
  .parserConfiguration({
    // https://github.com/yargs/yargs-parser/issues/162#issuecomment-516755542
    'duplicate-arguments-array': false,
  })
  .option('src-dir', {
    type: 'string',
    demandOption: true,
    requiresArg: true,
    describe: 'source directory to recursively process for media',
  })
  .option('dest-dir', {
    type: 'string',
    demandOption: true,
    requiresArg: true,
    describe: 'destination directory to copy media into',
  });

// Main
(async () => {
  const args = await parser.argv;
  for await (const file of getFiles(args.srcDir)) {
    if (!await acceptFile(file)) {
      continue;
    }
  }
})();
