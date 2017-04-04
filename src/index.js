
const traverse = require('traverse');
const strEscape = require('js-string-escape');

function json2faker(obj) {
  const code = [];

  traverse(obj).forEach(
    function genCode(node) {
      // process only the first item in array.
      if (Array.isArray(this.parent && this.parent.node) && this.key !== '0') {
        this.update(null, true);
        return;
      }
      if (Array.isArray(node)) {
        this.before(() => code.push('['));
        this.after(() => code.push(']'));
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
      else if (typeof node === 'string') {
        code.push('"');
        code.push(strEscape(node.toString()));
        code.push('"');
      }
      else {
        code.push(node.toString());
      }
      return;
    }
  );

  return code.join('');
}

module.exports = json2faker;
