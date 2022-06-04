import { Octokit } from "@octokit/rest";
import dotenv from 'dotenv';
import {execSync} from 'child_process'
import path from "path";
import fs from "fs";
import chalk from "chalk";

dotenv.config();

const octokit = new Octokit({
    auth: process.env.G_TOKEN
})

const fork = async(owner,repo) => {
  console.log(chalk.cyan('\nTrying to fork the repo\n'))
  try{
    const response = await octokit.request(`POST /repos/${owner}/${repo}/forks`, {
    owner: owner,
    repo: repo
    })
    if(response.status === 202){
      console.log(chalk.green('\nSuccessfully forked the repo\n'))
    }else{
      throw new Error('received wrong status code',{cause : response})
    }
    return response;
  }catch(err){
    throw new Error('Something went wrong during trying to fork the repo.', {cause : err});
  }
}

const clone_and_push = (repository, pckg, repo) => {
  try{
    fs.mkdirSync('./Temporary_Directory')
    console.log(chalk.green('Created a temporary directory with the name "Temporary Directory". This is where the repo will be cloned.'))
  }catch(err){
    if(err.code !== 'EEXIST'){
      console.log(err)
      throw new Error('There seems to be a problem while working with the filesystem.', {cause : err})
    }else if(err.code === 'EEXIST'){
      console.log(chalk.yellow(`\nThe repo will be cloned into the "Temporary Directory\\${repo}"\n`))
    }
  }
  try{
    console.log(chalk.cyan("\nTrying to clone the repo\n"))
    process.chdir('./Temporary_Directory')
    execSync(`git clone --filter=tree:0 --sparse --depth=1 ${repository + '.git'}`, {
      stdio : [0,1,2],
      cwd : path.resolve(process.cwd(), '')
    })
    console.log(chalk.cyan('\nCloning Done. Now Creating a new branch with the name "updates"\n'))
    process.chdir(`./${repo}`);
    execSync('git checkout -b updates', {
      stdio : [0,1,2],
      cwd : path.resolve(process.cwd(), '')
    })
    console.log(chalk.green("\nSuccessfully created a new branch\n"))
    console.log(chalk.cyan(`\nNow Updating the package to ${pckg}\n`))
    execSync(`npm i ${pckg}`, {
      stdio : [0,1,2],
      cwd : path.resolve(process.cwd(), '')
    })
    console.log(chalk.cyan(`\nUpdated the package to ${pckg}\n`))
    console.log(chalk.cyan('\nNow trying to commit...\n'))
    execSync('git add .', {
      stdio : [0,1,2],
      cwd : path.resolve(process.cwd(), '')
    })
    execSync(`git commit -m "auto updated to ${pckg}"`, {
      stdio : [0,1,2],
      cwd : path.resolve(process.cwd(), '')
    })
    console.log(chalk.cyan('\nNow trying to push to origin...\n'))
    execSync("git push origin updates", {
      stdio : [0,1,2],
      cwd : path.resolve(process.cwd(), '')
    })
    console.log(chalk.green("\nSuccessfully cloned the repo, created a branch, updated the package and pushed to origin.\n"))

    process.chdir('../../')
    return true;
  }catch(err){
    throw new Error('Something went wrong during trying to clone undate and push.', {cause : err})
  }
  
}

const pull = async (owner, repo,login, pckg) => {
  console.log(chalk.cyan('\nTrying to generate a PR(Pull Request)\n'))
  try{
    let {data : {default_branch}} = await octokit.request(`GET /repos/${owner}/${repo}`, {
      owner: owner,
      repo: repo
    })
    const response = await octokit.request(`POST /repos/${owner}/${repo}/pulls`, {
      owner: owner,
      repo: repo,
      title: `Upgraded a package named ${pckg}`,
      body: 'Please pull these awesome changes in!',
      head: `${login}:updates`,
      base: default_branch
    })
    if(response.status === 201){
      console.log(chalk.green(`\nSuccessfully generated a PR at ${owner}/${repo}...Hopefully the author will see it and value your contribution. ;)\n`))
      return response
    }else{
      throw new Error('Received Wrong Status Code', {cause : response})
    }
  }catch(err){
    throw new Error('Something went wrong during trying to create a Pull Request.', {cause : err})
  }
  
}

const updateDependency = async (user, repo, pckg, ownRepo) => {
    try{
      let forkResponse;
      if(!ownRepo){
        forkResponse = await fork(user, repo);
      }
      const repoLinkToClone = forkResponse?.data["html_url"] || `https://github.com/${user}/${repo}`;
      let cloneResponse = clone_and_push(repoLinkToClone, pckg, repo);
      let {data : {login}} = await octokit.request('GET /user', {})
      let pullResponse = await pull(user, repo, login, pckg)
      return pullResponse.data["html_url"];
    }catch(err){
      console.log(chalk.red(`\nSomething looks suspicious. Here take a look at the error ${err}\n`))
    }
}


export {
    fork,
    clone_and_push,
    pull,
    updateDependency
};