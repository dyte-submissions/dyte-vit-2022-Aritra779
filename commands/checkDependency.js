import fs from 'fs';
import { rm } from 'fs/promises';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import chalk from 'chalk';
import { Octokit } from "@octokit/rest";
import gh from 'github-url-to-object';
import {updateDependency} from './updateDependency.js';
import checkVersion from './checkVersion.js';

const octokit = new Octokit({})

const removeDirectory = async (dirPath) => {
    try {
      await rm(dirPath, { recursive: true });
      console.log(chalk.green("Directory removed!"));
    } catch (err) {
      console.log(chalk.red('Something went wrong while deleting a directory. Please delete them manually'));
    }
  };

const checkDependency =  (fileName, pckgDet,updateFlag = false, forceFlag = false) => {
    const file = fileName;
    let deleteFlag = false;
    const [packageName, packageVersion] = pckgDet.split('@');
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
                const {user, repo, branch} = gh(inputData[i].repo);
                let getResponse;
                if(branch === 'master'){
                    getResponse = await octokit.request(`GET /repos/${user}/${repo}/contents/package.json`, {
                        owner: user,
                        repo: repo,
                        path: './package.json'
                      })
                }else{
                    getResponse = await octokit.request(`GET /repos/${user}/${repo}/contents/package.json`, {
                        owner: user,
                        repo: repo,
                        path: './package.json',
                        ref : branch
                      })
                }
                const pkg = JSON.parse(Buffer.from(getResponse.data.content, getResponse.data.encoding).toString());
                const pkg_version = pkg.dependencies[packageName];
                inputData[i].version = pkg_version;
                if(pkg_version){
                let checkResponse = checkVersion(pkg_version, packageVersion);
                    if(checkResponse.satisfied){
                        console.log(chalk.green(`Found Version ${pkg_version}`));
                        inputData[i].version_satisfied = true;
                    }else if(checkResponse.forceRequired){
                        console.log(chalk.yellow(`Found Version ${pkg_version}`));
                        inputData[i].version_satisfied = false;
                        if(updateFlag && forceFlag){
                            console.log(chalk.bgRed('Updating to the specified version might break certain features. Still trying to update since -f or -force is used.'));
                            inputData[i].update_pr =  await updateDependency(user, repo, pckgDet);
                            deleteFlag = true;
                        }else if(updateFlag){
                            console.log(chalk.red('Updating to the specified version might break certain features. Hence Update not initiated. If you want to update it anyhow then pass the -f or -force option.'));
                        }
                    }else{
                        console.log(chalk.yellow(`Found Version ${pkg_version}`));
                        inputData[i].version_satisfied = false;
                        if(updateFlag){
                            inputData[i].update_pr =  await updateDependency(user, repo , pckgDet);
                            deleteFlag = true;
                        }
                    }
                }else{
                console.log(chalk.red('Package not found on dependency List'))
                }
            }

            outputCSV.writeRecords(inputData)
            .then(() => {
                console.log(chalk.bgGreen("Job Done!"))
            });
            if(deleteFlag) removeDirectory('./Temporary_Directory');
        })
        
}

export default checkDependency;