
/**
 * @param {string} data
 * @returns {any}
 */
module.exports.default = function parseObjects(data) {

  const begins = [];
  const ends = [];

  for(let i = data.indexOf('{{'); i >= 0; i = data.indexOf('{{', i + 2))
    begins.push(i + 2);

  for(let i = data.indexOf('}}'); i >= 0; i = data.indexOf('}}', i + 2))
    ends.push(i);

  const sections = {};

  for(const i of begins) sections[i] = true;
  for(const i of ends) sections[i] = false;

  const objects = [];

  let depth = 0;
  let root = { children: objects };
  let obj = root;
  for(const key in sections) {
    if(sections[key]) {
      depth++;
      const i = obj.children.push({
        parent: obj,
        begin: key,
        children: []
      });
      obj = obj.children[i - 1];
    } else {
      depth--;
      obj.end = key;

      const slice = data.slice(obj.begin, obj.end);
      const curlyRefs = slice.match(/{{(?:.+?\|)+.+?}}/gm);
      const squareRefs = slice.match(/\[\[(?:.+?\|)*.+?\]\]/gm);
      const toParse = slice.replace(/{{(?:.+?\|)+.+?}}/gm, '{{$$REF$$}}').replace(/\[\[(?:.+?\|)*.+?\]\]/gm, '[[$$REF$$]]')

      let cRefI = 0;
      let sRefI = 0;

      obj.vars = toParse.split('|').map(a => a.replace('{{$REF$}}', () => curlyRefs[cRefI++]).replace('[[$REF$]]', () => squareRefs[sRefI++]).trim());

      obj.name = obj.vars.shift();

      const o = obj.parent;
      delete obj.parent;
      obj = o;
    }
  }

  return objects;
}
