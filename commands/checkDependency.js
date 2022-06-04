import { createReadStream, createWriteStream } from 'fs';
import { rm } from 'fs/promises';
import { createInterface } from 'readline';
import dotevn from 'dotenv';
import chalk from 'chalk';
import { Octokit } from "@octokit/rest";
import gh from 'github-url-to-object';
import {updateDependency} from './updateDependency.js';
import checkVersion from './checkVersion.js';


dotevn.config()
const octokit = new Octokit({
    auth: process.env.G_TOKEN
})

const removeDirectory = async (dirPath) => {
    try {
      console.log(chalk.yellow('\nTrying to remove the auto generated temporary directory now. This might take some(a lot) time. If you don\'t want to wait anymore then stop the process here and delete the directory manually. Core task has already been performed there\'s no harm in stopping this now...\n'))
      await rm(dirPath, { recursive: true });
      console.log(chalk.green('Directory Removed!'));
    } catch (err) {
      console.log(chalk.red('Something went wrong while deleting a directory. Please delete them manually'));
    }
  };

const checkDependency = async (fileName, pckgDet,updateFlag = false, forceFlag = false, ownRepo = false ,startCount) => {
    startCount = Number(startCount)
    let deleteFlag = false;
    const [packageName, packageVersion] = pckgDet.split('@');
    const authFlag = process.env.G_TOKEN !== undefined && process.env.G_TOKEN !== '' && process.env.G_TOKEN !== null
    if(updateFlag && !authFlag){
        console.log(chalk.bgRed('Update Requires github PAT which is not set. Please set it before using the update flag. For more info on how to get github PAT, check out the project readme file.'))
        return
    }
    let count = -1;
    const file_name = fileName.slice(0,fileName.length - 4);
    let writer = createWriteStream(`${file_name}_output.csv`,{flags : startCount === 0 ? 'w' : 'a'});
    const rl = createInterface({
        input : createReadStream(fileName),
        crlfDelay : Infinity,
        output : writer
    })
    let maxReq = updateFlag ? 999 : (authFlag ? 4999 :59);
    for await (const line of rl){
        let arr = line.split(',')
        if((count - startCount)>= maxReq){
            console.log(chalk.red(`Maximum Request limit for an hour reached. Please try again an hour later. Otherwise there might be some unwanted issues...`))
            console.log(chalk.cyanBright(`Execution stopped at row number ${count}. Please note this index down and try running the tool an hour later with 'start' flag with this value. It'll start the execution from this row.`))
            return
        }else if(count >= startCount){
            arr[3] = false;
            arr[4] = "";
            console.log(chalk.cyan(`Package : ${count + 1}`))
            console.log(chalk.blue(`checking package ${arr[0]} from ${arr
            [1]}`))
            const {user, repo, branch} = gh(arr[1]);
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
            arr[2] = pkg_version;
            if(pkg_version){
            let checkResponse = checkVersion(pkg_version, packageVersion);
                if(checkResponse.satisfied){
                    console.log(chalk.green(`Found Version ${pkg_version}`));
                    arr[3] = true;
                }else if(checkResponse.forceRequired){
                    console.log(chalk.yellow(`Found Version ${pkg_version}`));
                    arr[3] = false;
                    if(updateFlag && forceFlag){
                        console.log(chalk.bgRed('Updating to the specified version might break certain features. Still trying to update since -f or -force is used.'));
                        arr[4] =  await updateDependency(user, repo, pckgDet, ownRepo);
                        deleteFlag = true;
                    }else if(updateFlag){
                        console.log(chalk.red('Updating to the specified version might break certain features. Hence Update not initiated. If you want to update it anyhow then pass the -f or -force option.'));
                    }
                }else{
                    console.log(chalk.yellow(`Found Version ${pkg_version}`));
                    arr[3] = false;
                    if(updateFlag){
                        arr[4] =  await updateDependency(user, repo , pckgDet, ownRepo);
                        deleteFlag = true;
                    }
                }
            }else{
            console.log(chalk.red('Package not found on dependency List'))
            }
            writer.write(arr.join(',')+"\r\n");
        }
        if(count == -1 && startCount == 0){
            let col = ["version", "version_satisfied", "updated_pr"];
            arr = [...arr,...col];
            let op = [];
            for(let el of arr){
                if(!op.includes(el)) op.push(el)
            }
           writer.write(op.join(',') + "\r\n")
        }
        count++
    }
    console.log(chalk.green(`Total ${count} packages were checked.`))
    if(deleteFlag) await removeDirectory('./Temporary_Directory');
    console.log(chalk.bgGreen("Job Done!"))

    writer.on('error', err => {
        console.log(chalk.red(`Something Went Wrong. Here take a look at the error : \n${err}`))
    })
}
export default checkDependency;