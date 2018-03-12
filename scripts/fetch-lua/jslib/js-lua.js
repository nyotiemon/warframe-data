/**
 * Original by Ensequence Inc.
 * MIT licensed
 * Source: https://github.com/Ensequence/js2lua/blob/master/lib/converter.js
 */

function escapeString(str) {
  return str
    .replace(/\n/g,'\\n')
    .replace(/\r/g,'\\r')
    .replace(/"/g,'\\"')
    .replace(/\\$/g, '\\\\');
}

/**
 * Converts an object to a lua representation
 *
 * @param {any} obj object to convert
 * @param {number} whitespace spaces to indent
 * @param {string} indent internal use
 * @return string
 */
module.exports.toLua = function toLua (obj, whitespace, indent) {

  whitespace = whitespace || 5;
  indent = indent || '';
  let prev_indent = indent;
  // Setup whitespace

  // Get type of obj
  let type = typeof obj;

  // Handle type
  if (['number', 'boolean'].indexOf(type) >= 0) {
    return obj;
  } else if (type === 'string') {
    return JSON.stringify(obj);
  } else if (obj == null) {
    // Return 'nil' for null || undefined
    return 'nil';
  } else {
    // Object
    // Increase indentation
    for (let i = 0, previous = indent; i < whitespace; indent += ' ', i++);

    // Check if array
    if (obj instanceof Array) {
      // Convert each item in array, checking for whitespace
      if (whitespace) return '{\n' + indent + obj.map((prop) => toLua(prop, whitespace, indent)).join(',\n' + indent) + '\n' + prev_indent + '}';
      else return '{' + obj.map((prop) => toLua(prop, whitespace)).join(',') + '}';
    } else {
      // Build out each property
      var props = [];
      for (var key in obj)
        props.push((/^[a-zA-Z_]\w*$/.test(key) ? key : `["${key}"]`) + (whitespace ? ' = ' + toLua(obj[key], whitespace, indent) : '=' + toLua(obj[key], whitespace)));

      // Join properties && return
      if (whitespace) return '{\n' + indent + props.join(',\n' + indent) + '\n' + prev_indent + '}';
      else return '{' + indent + props.join(',') + '}';
    }
  }
}

/**
 * Converts a lua object to a js object
 *
 * @param {string} lua the lua object to convert
 * @return {any}
 */
module.exports.toJS = function toJS(lua) {
  // convert keys properly, convert = to :
  lua = lua.replace(/(?:(?:(?:\[")(.+)(?:"\]))|([a-zA-Z_]\w+))\s*=\s*/g, '"$1$2": ');

  // remove comment section after double dash
  lua = lua.replace(/--.*\n/g, "");

  // pull strings out
  let i = 0;
  const strings = [];
  lua = lua.replace(/"(.+?(?:[^\\]|\\.))"/g, (sub) => {
    strings.push(sub);
    return `$s${i++}$`;
  });

  lua = lua.replace(/nil/g, 'null'); // replace nil with null
  lua = lua.replace(/([^\w])(\.\d)/g, '$10$2') // clean up decimal points

  let j = 0;
  let objects = [];

  let lastJ = -1;
  while(lastJ !== j) { // replace objects
    lastJ = j;
    lua = lua.replace(/{[^{]+?}/, (sub) => {
      objects.push(sub);
      return `$o${j++}$`
    });
  }

  objects = objects.map(o => {
    if(/{(\s*([^:]+?),?)}/.test(o))
      return o.replace('{', '[').replace('}', ']');
    else
      return o;
  });

  j = 0;
  lastJ = -1;
  while(lastJ !== j) { // put objects back
    lastJ = j;
    lua = lua.replace(/\$o(\d+)\$/g, (sub, $1) => {
      j++;
      return objects[$1];
    });
  }

  lua = lua.replace(/\$s(\d+)\$/g, (sub, $1) => strings[$1]); // put strings back

  lua = lua.replace(/,(\s*(?:}|]))/g, '$1'); // clean up extra commas

  return JSON.parse(lua);
}
