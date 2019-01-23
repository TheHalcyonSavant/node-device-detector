const ClientAbstractParser = require('./../client-abstract-parser');
const util = require('util');

const CLIENT_TYPE = require('./../const/client-type');

function PIM() {
  this.fixtureFile = 'client/pim.yml';
  this.loadCollection();
  this.reset();
}

util.inherits(PIM, ClientAbstractParser);


PIM.prototype.parse = function(userAgent){

  if (ClientAbstractParser.prototype.parse.call(this, [userAgent])) {
    this.type = CLIENT_TYPE.PIM;
    return true;
  }
  return false
};

module.exports = PIM;