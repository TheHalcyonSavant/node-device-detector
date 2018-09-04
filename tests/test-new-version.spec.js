const detector = new (require('../new-index'));


const should = require('chai').should;
const assert = require('chai').assert;
const expect = require('chai').expect;

// fixture format
/*
  user_agent: ""
  os:
    name: Android
    short_name: AND
    version: "2.3.6"
    platform: ""
  client:
    type: browser
    name: Android Browser
    short_name: AN
    version: ""
    engine: WebKit
    engine_version: "533.1"
  device:
    type: smartphone
    brand: HU
    model: U8655
  os_family: Android
  browser_family: Android Browser
*/


const fs = require('fs');
const YML = require('yamljs');
const util = require('util');

let ymlFiles = [];
let fixtureFolder = __dirname + '/fixtures/tests/';

ymlFiles = fs.readdirSync(fixtureFolder);

function perryJSON(obj){
  return JSON.stringify(obj,  null, 2);
}


function isObjNotEmpty(value) {
  return typeof value !== 'undefined' && value!== null;
}

function testsFromFixture(fixture){
  let result;
  try {
    console.log('UserAgent\n\x1b[33m%s\x1b[0m', fixture.user_agent);
    result = detector.detect(fixture.user_agent);
    console.log('Result\n\x1b[34m%s\x1b[0m', perryJSON(result));
    console.log('Fixture\n\x1b[36m%s\x1b[0m', perryJSON(fixture));
  } catch (e) {
    throw new SyntaxError(e.stack);
  }

  let messageError = 'fixture data\n' + perryJSON(fixture);

  // test device data
  if (isObjNotEmpty(fixture.device)) {

    if(isObjNotEmpty(fixture.device.model)){

      expect(null, messageError).to.not.equal(result.device);
      expect(String(fixture.device.model), messageError).to.equal(result.device.model);
    }
    if(isObjNotEmpty(fixture.device.type)){
      expect(String(fixture.device.type), messageError).to.equal(result.device.type);
    }

  }

  // test os data
  if (isObjNotEmpty(fixture.os))  {

    if(isObjNotEmpty(fixture.os.name)){
      expect(fixture.os.name, messageError).to.have.deep.equal(result.os.name);
    }
    if(isObjNotEmpty(fixture.os.short_name)){
      expect(fixture.os.short_name, messageError).to.have.deep.equal(result.os.short_name);
    }
    if(isObjNotEmpty(fixture.os.version)){
      expect(fixture.os.version, messageError).to.have.deep.equal(result.os.version);
    }
    if(isObjNotEmpty(fixture.os.platform)){
      expect(fixture.os.platform, messageError).to.have.deep.equal(result.os.platform);
    }

  }

  // test client data
  if (isObjNotEmpty(fixture.client)) {
    if(fixture.client.version === null){
      fixture.client.version = '';
    }
    expect(fixture.client.name, messageError).to.have.deep.equal(result.client.name);
    expect(fixture.client.type, messageError).to.have.deep.equal(result.client.type);
    expect(fixture.client.version, messageError).to.have.deep.equal(result.client.version);

    if(isObjNotEmpty(fixture.client.short_name)){
      expect(String(fixture.client.short_name), messageError).to.have.deep.equal(result.client.short_name);
    }
    if(isObjNotEmpty(fixture.client.engine)){
      expect(String(fixture.client.engine), messageError).to.have.deep.equal(result.client.engine);
    }
    if(isObjNotEmpty(fixture.client.engine_version)){
      expect(String(fixture.client.engine_version), messageError).to.have.deep.equal(result.client.engine_version);
    }



  }

}


describe('tests one file', function () {
  let file = 'console.yml';
  let fixtureData = YML.load(fixtureFolder + file);
  let total = fixtureData.length;
  //fixtureData= [  fixtureData[1] ];

  fixtureData.forEach(function (fixture, pos) {
    it(pos + '/' + total, () => {
      testsFromFixture(fixture);
    });
  });
});

return;

describe('tests', function () {
  this.timeout(6000);
  ymlFiles.forEach(function (file) {

    if(file === 'bots.yml'){
      return;
    }

    describe('file fixture ' + file, function () {
      let fixtureData = YML.load(fixtureFolder + file);
      let total = fixtureData.length;
      //fixtureData= [  fixtureData[208] ];
      fixtureData.forEach(function (fixture, pos) {
        it(pos + '/' + total, () => {
          testsFromFixture(fixture);
        });
      });
    });
  })
});
