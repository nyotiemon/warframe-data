
module.exports = module.exports || {};

/**
 * @param {string} a
 * @return {any}
 */
function tryParseVar(a) {
  if(a == null) return a;
  try {
    return JSON.parse(a);
  } catch(e) {
    return '' + a;
  }
}

module.exports.tryParseVar = tryParseVar;

/**
 * @param {any[]} i
 * @return string
 */
module.exports.s = function s(...i) { return i.find(a => a ? ('' + a) : null) || ''; }

/**
 * @param {any[]} i
 * @return number
 */
module.exports.i = function i(...i) { return i.find(a => a ? +a : null) || 0; }

/**
 * @param {string[]} vars
 * @return {any}
 */
module.exports.splitVars = function splitVars(vars) {
  const data = {};
  for(const line of vars) {
    const split = line.split(/\s*=\s*/);
    data[split[0]] = tryParseVar(split[1]);
  }
  return data;
}

