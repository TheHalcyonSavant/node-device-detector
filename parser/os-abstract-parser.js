const ParserAbstract = require('./abstract-parser');
const util = require('util');

function OsAbstractParser() {
  this.fixtureFile = 'oss.yml';
  this.loadCollection();
  this.reset();
}

util.inherits(OsAbstractParser, ParserAbstract);

OsAbstractParser.prototype.os_systems = require('./os/os_systems');
OsAbstractParser.prototype.os_families = require('./os/os_families');

OsAbstractParser.prototype.getParseData = function(){
  return {
    short_name: this.short_name,
    name: this.name,
    version: this.version,
    platform: this.platform,
    family: this.family
  };
};

/**
 * @param name
 * @return {*}
 */
OsAbstractParser.prototype.parseOsFamily = function(name){
  for(let family in this.os_families){
    if (this.os_families[family].indexOf(name) !== -1) {
      return String(family);
    }
  }
  return '';
};

OsAbstractParser.prototype.parse = function (userAgent) {
  this.reset();

  for (let i = 0, l = this.collection.length; i < l; i++) {
    let item = this.collection[i];
    let regex = this.getBaseRegExp(item.regex);
    let match = regex.exec(userAgent);
    if (match !== null) {
      let name = this.buildByMatch(item.name, match);
      let short = 'UNK';
      for(let key in this.os_systems){
        if (String(name).toLowerCase() === String(this.os_systems[key]).toLowerCase()) {
          name = this.os_systems[key];
          short = key;
          break;
        }
      }

      this.name = name;
      this.short_name = short;
      this.version = this.buildVersion(item.version, match);
      this.platform = this.parsePlatform(userAgent);
      this.family = this.parseOsFamily(short);

      return true
    }
  }

  return false;
};

OsAbstractParser.prototype.reset = function () {
  this.short_name = '';
  this.name = '';
  this.version = '';
  this.platform = '';
  this.family = '';
};

/**
 * parse ua platform
 * @param userAgent {string}
 * @return {string}
 */
OsAbstractParser.prototype.parsePlatform = function (userAgent) {
  if (this.getBaseRegExp('arm').test(userAgent)) {
    return 'ARM';
  } else if (this.getBaseRegExp('WOW64|x64|win64|amd64|x86_6').test(userAgent)) {
    return 'x64';
  } else if (this.getBaseRegExp('i[0-9]86|i86pc').test(userAgent)) {
    return 'x86';
  }
  return '';
};

module.exports = OsAbstractParser;
module.exports.OsAbstractParser = OsAbstractParser;
