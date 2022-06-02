#! /usr/bin/env node
import { Command, program } from 'commander';
import checkDependency from './commands/checkDependency.js';

program
    .argument('<string>','name of the csv file(along with extension)')
    .argument('<string>' , 'name of the package / library to check')
    .requiredOption('-i, -input', 'takes input in the form of a .csv file and a package/library name along with version')
    .option('-u, -update' , 'fork -> clone -> update -> push -> create PR')
    .action((first, second, options) => {
         checkDependency(first, second, options.Update === true);
    })

program.parse();