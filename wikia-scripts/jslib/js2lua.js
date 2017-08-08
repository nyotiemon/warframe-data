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
module.exports.convert = function convert (obj, whitespace, indent) {

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
      if (whitespace) return '{\n' + indent + obj.map((prop) => convert(prop, whitespace, indent)).join(',\n' + indent) + '\n' + prev_indent + '}';
      else return '{' + obj.map((prop) => convert(prop, whitespace)).join(',') + '}';
    } else {
      // Build out each property
      var props = [];
      for (var key in obj)
        props.push((/^[a-zA-Z_]\w*$/.test(key) ? key : `["${key}"]`) + (whitespace ? ' = ' + convert(obj[key], whitespace, indent) : '=' + convert(obj[key], whitespace)));

      // Join properties && return
      if (whitespace) return '{\n' + indent + props.join(',\n' + indent) + '\n' + prev_indent + '}';
      else return '{' + indent + props.join(',') + '}';
    }
  }
}
