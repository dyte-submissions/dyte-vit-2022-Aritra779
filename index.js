#! /usr/bin/env node
import { program } from 'commander';
import checkDependency from './commands/checkDependency.js';

program
    .argument('<File_Name>','name of the csv file(along with extension)')
    .argument('<Package_Name@Version>' , 'package / library to check along with version to check against in the format <package_Name@package_version>')
    .version('1.2.0')
    .requiredOption('-i, --input', 'takes input in the form of a .csv file and a package/library name along with version')
    .option('-u, --update' , '(optionally fork) -> clone -> update -> push -> create PR')
    .option('-f, --force', 'forcefully runs the task even if it might involve some breaking changes')
    .option('-s --start <Row_Index>',"Mention which row(0 indexed) to start from. If file has no header mention -1. Please use this flag as the last flag.",0)
    .option('-o --own', 'You\'re the owner(or have write access) of all the repositories listed in the file. Hence no forking will be done.')
    .action((first, second, options) => {
        checkDependency(first, second, options.update === true, options.force === true,options.own === true, options.start);
    })
    

program.parse();