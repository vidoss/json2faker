
const traverse = require('traverse');
const prettier = require('prettier');
const strEscape = require('js-string-escape');

const prettierConfig = {
  printWidth: 128,
};

function genFaker(key, value) {
  return key === '0' ? 'first' : key;
}

function json2faker(obj) {
  const code = [];

  traverse(obj).forEach(
    function genCode(node) {
      // process only the first item in array.
      if (Array.isArray(this.parent && this.parent.node) && this.key !== '0') {
        this.update(null, true);
      }
      else if (Array.isArray(node)) {
        this.before(() => code.push(`Array(${node.length}).fill().map( (unused, idx)=>(`));
        this.after(() => code.push('))'));
      }
      else if (typeof node === 'object') {
        this.before(() => code.push('{'));
        this.pre((x, key) => {
          genCode(key);
          code.push(':');
        });
        this.post((child) => {
          if (!child.isLast) {
            code.push(',');
          }
        });
        this.after(() => code.push('}'));
      }
      else if (this.isLeaf) {
        code.push(`faker.${genFaker(this.key, node)}()`);
      }
      else if (typeof node === 'string') {
        code.push('"');
        code.push(strEscape(node.toString()));
        code.push('"');
      }
      else {
        code.push(node.toString());
      }
    }
  );

  return prettier.format(code.join(''), prettierConfig);
}

module.exports = json2faker;
