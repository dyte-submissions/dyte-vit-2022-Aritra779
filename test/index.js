import { expect} from 'chai'
import nock from 'nock'
import getPackage from 'get-repo-package-json'
import nightmare from './testData/nightmare.json' assert { type: 'json' };
import forkResponse from './testData/forkResponse.json' assert {type : 'json'};
import {fork, clone} from '../commands/updateDependency.js';
import dotenv from 'dotenv';

dotenv.config()
nock.disableNetConnect()

const getApi = (path) => {
  return nock('https://api.github.com').get(path)
}

const postApi = (path) => {
  return nock('https://api.github.com')
    .intercept(path, 'POST');
}

const putApi = (path) => {
  return nock('https://api.github.com')
  .intercept(path, 'PUT')
}



describe('getRepoPackageJSON', () => {
    it("returns package.json", async () =>{
      let mock = getApi('/repos/Aritra779/kolom/contents/package.json').reply(200, nightmare);
      let pkg  = await getPackage("https://github.com/Aritra779/kolom")
        expect(pkg).to.be.an('object')
        expect(pkg.name).to.be.a('string')
        expect(pkg.dependencies).to.be.an('object')
    })
})

describe('GITHUB REST API' , () => {
  it('fork test', async () => {
    let mock = postApi(/\/repos\/.+\/.+\/forks/i).reply(202, forkResponse)
    let response = await fork('someone','Hello-World');
    expect(response.status).to.equal(202);
  })

  /*it('clone test', () => {
    let response = clone('https://github.com/Aritra779/Hello-World','axios@0.23.0', 'Hello-World')
    expect(response).to.equal(true);
  })*/
})