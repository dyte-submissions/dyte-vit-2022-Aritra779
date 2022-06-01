import { Octokit } from "@octokit/rest";
import gh from 'github-url-to-object';
import dotenv from 'dotenv';
import {execSync} from 'child_process'
import path,{ join } from "path";
import fs from "fs";
import chalk from "chalk";

dotenv.config();

const octokit = new Octokit({
    auth: process.env.G_TOKEN
})

const fork = async(owner,repo) => {
  console.log(chalk.cyan('\nTrying to fork the repo\n'))
    const response = await octokit.request(`POST /repos/${owner}/${repo}/forks`, {
    owner: owner,
    repo: repo
  })
  console.log(chalk.green('\nSuccessfully forked the repo\n'))
  return response;
}

const clone = (repository, pckg, repo) => {
  try{
    fs.mkdirSync('./Temporary_Directory')
    console.log(chalk.green('Created a temporary directory with the name "Temporary Directory". This is where the repo will be cloned.'))
  }catch(err){
    if(err.code !== 'EEXIST'){
      console.log(err)
    }else if(err.code === 'EEXIST'){
      console.log(chalk.yellow(`\nThe repo will be cloned into the "Temporary Directory\\${repo}"\n`))
    }
  }
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
  execSync('git add .', {
    stdio : [0,1,2],
    cwd : path.resolve(process.cwd(), '')
  })
  execSync(`git commit -m "auto updated to ${pckg}"`, {
    stdio : [0,1,2],
    cwd : path.resolve(process.cwd(), '')
  })
  execSync("git push origin updates", {
    stdio : [0,1,2],
    cwd : path.resolve(process.cwd(), '')
  })
  console.log(chalk.green("\nSuccessfully cloned the repo, created a branch and updated the package\n"))
  
process.chdir('../../')
    return true;
}

const pull = async (owner, repo,login, pckg) => {
  console.log(chalk.cyan('\nTrying to generate a PR(Pull Request)\n'))
  const response = await octokit.request(`POST /repos/${owner}/${repo}/pulls`, {
    owner: "owner",
    repo: repo,
    title: `Upgraded a package named ${pckg}`,
    body: 'Please pull these awesome changes in!',
    head: `${login}:updates`,
    base: 'main'
  })
  console.log(chalk.green(`\nSuccessfully generated a PR at ${owner}/${repo}...Hopefully the author will see it and value your contribution. ;)\n`))
  return response
}

const updateDependency = async (repository, pckg) => {
    let repoParts = gh(repository)
    let forkResponse = await fork(repoParts.user, repoParts.repo);
    let cloneResponse = clone(forkResponse.data["html_url"], pckg,repoParts.repo);
    let {data : {login}} = await octokit.request('GET /user', {})
    let pullResponse = await pull(repoParts.user,repoParts.repo, login, pckg)
    return pullResponse.data.url;

}

export {
    fork,
    clone,
    pull,
    updateDependency
};