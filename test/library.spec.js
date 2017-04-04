/* global describe, it, before */

const chai = require('chai');
const j2f = require('../lib/json2faker.js');

chai.expect();

const expect = chai.expect;

let j2fn;

describe('When calling require() of json2faker', () => {
  before(() => {
    j2fn = j2f;
  });
  describe('when I need the name', () => {
    it('should return typeof === function', () => {
      expect(typeof j2fn).to.be.equal('function');
    });
  });
});
