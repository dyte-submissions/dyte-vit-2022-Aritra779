import { expect} from 'chai';
import nock from 'nock';
import getResponse from './testData/getResponse.json' assert { type: 'json' };
import getResponse2 from './testData/getResponse2.json' assert { type: 'json' };
import forkResponse from './testData/forkResponse.json' assert {type : 'json'};
import pullPesponse from './testData/pullResponse.json' assert {type : 'json'};
import {fork, clone_and_push, pull} from '../commands/updateDependency.js';
import dotenv from 'dotenv';
import { Octokit } from '@octokit/rest';

dotenv.config();
nock.disableNetConnect();

const getApi = (path) => {
  return nock('https://api.github.com').get(path);
}

const postApi = (path) => {
  return nock('https://api.github.com')
    .intercept(path, 'POST');
}



describe('Getting the package.json of a Repository', () => {
  const octokit = new Octokit({});
    it("testing without ref argument", async () =>{
      let mock = getApi(/\/repos\/.+\/.+\/contents\/package.json(\?ref=.+)?/i).reply(200, getResponse);
      let response = await octokit.request(`GET /repos/someone/somerepo/contents/package.json`, {
        owner: 'someone',
        repo: 'somerepo',
        path: './package.json',
      })
      expect(response).to.be.an('object');
      expect(response.status).to.be.equal(200);
      expect(response.data).to.be.an('object');
      expect(response.data.name).to.be.equal('package.json');
      expect(response.data.content).to.be.a('string');
    })

    it("testing with ref argument", async () =>{
      let mock = getApi(/\/repos\/.+\/.+\/contents\/package.json(\?ref=.+)?/i).reply(200, getResponse2);
      let response = await octokit.request(`GET /repos/someone/somerepo/contents/package.json`, {
        owner: 'someone',
        repo: 'somerepo',
        path: './package.json',
        ref : 'updates'
      })
      expect(response).to.be.an('object');
      expect(response.status).to.be.equal(200);
      expect(response.data).to.be.an('object');
      expect(response.data.name).to.be.equal('package.json');
      expect(response.data.content).to.be.a('string');
    })
})

describe('Fork-> Clone -> Push -> Pull' , () => {
  it('fork test', async () => {
    try{
      let mock = postApi(/\/repos\/.+\/.+\/forks/i).reply(202, forkResponse);
    let response = await fork('someone','Hello-World');
    expect(response.status).to.equal(202);
    expect(response.data['full_name']).to.be.a('string');
    expect(response.data['html_url']).to.be.a('string');
    expect(response.data.parent).to.be.an('object');
    expect(response.data.source).to.be.an('object');
    }catch(err){
      console.log(err)
    }
  })

  it('pull test' , async () => {
    let mock = postApi(/\/repos\/.+\/.+\/pulls/i).reply(201, pullPesponse);
    try{
      let response = await pull('main-repo-owner','Main_Repo', 'forked-repo-owner', 'axios@0.25.0');
      expect(response.status).to.be.equal(201);
      expect(response.data).to.be.an('object');
      expect(response.data.url).to.be.a('string');
    }catch(err){
      console.log(err)
    }
    
  })
})