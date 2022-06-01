import fs from 'fs';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import chalk from 'chalk';
import getPackage from 'get-repo-package-json';
import {updateDependency} from './updateDependency.js';

const checkDependency =  (fileName, pckgDet,flag = false) => {
    const file = fileName;
    const pckg = pckgDet;
    const [packageName, packageVersion] = pckg.split('@');
    const inputData = [];
    const outputCSV = createObjectCsvWriter({
        path : fileName,
        header : [
            {id : 'name', title : 'name'},
            {id : 'repo' , title : 'repo'},
            {id : 'version' , title : 'version'},
            {id : 'version_satisfied' , title : 'version_satisfied'},
            {id : 'update_pr', title : 'update_pr'}
        ]
    });

    fs.createReadStream(file)
        .pipe(csv())
        .on('data', data => inputData.push(data))
        .on('end' , async () => {  
            console.log(chalk.green('Please Wait . . .'));
            for(let  i = 0; i < inputData.length; i++){
               console.log(chalk.cyan(`Checking Package [${(i+1)} / ${inputData.length}]`));
                console.log(chalk.blue(`checking package ${inputData[i].name} from ${inputData[i].repo}`));
                await getPackage(inputData[i].repo)
                .then(async(pkg) => {

                    const version = pkg.dependencies[packageName]?.slice(1);
                    inputData[i].version = version;
                    if(version && version >= packageVersion){
                        console.log(chalk.green(`Found Version ${version}`));
                        inputData[i].version_satisfied = true;
                    }else if(version){
                        console.log(chalk.yellow(`Found Version ${version}`));
                        inputData[i].version_satisfied = false;
                        if(flag){
                            inputData[i].update_pr =  await updateDependency(inputData[i].repo, pckg);
                        }
                    }else{
                        console.log(chalk.red('Package not found on dependency List'))
                    }
                })
            }

            outputCSV.writeRecords(inputData)
            .then(() => {
                console.log("Job Done!")
            });
        })
    
    
        
}

export default checkDependency;