#! /usr/bin/env node
import { program } from 'commander';
import checkDependency from './commands/checkDependency.js';

program
    .argument('<string>','name of the csv file(along with extension)')
    .argument('<string>' , 'package / library to check along with version to check against in the format <package_Name@package_version>')
    .version('0.1.0')
    .requiredOption('-i, --input', 'takes input in the form of a .csv file and a package/library name along with version')
    .option('-u, --update' , 'fork -> clone -> update -> push -> create PR')
    .option('-f, --force', 'forcefully runs the task even if it might involve some breaking changes')
    .action((first, second, options) => {
         checkDependency(first, second, options.update === true, options.force === true);
    })
    

program.parse();