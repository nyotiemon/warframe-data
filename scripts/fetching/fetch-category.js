const request = require('request-promise-native');

module.exports.default = async function fetchCategory(name, fetchLimit) {
  let results = [];
  let foo;
  foo = (offset) => request(`http://warframe.wikia.com/api/v1/Articles/List?category=${name}&limit=${fetchLimit}&namespaces=0` + (offset ? `&offset=${offset}` : '')).then(res => {
    const data = JSON.parse(res);
    results.push(...(data.items));
    if(data.offset) return foo(data.offset);
  });
  await foo();
  return results;
}
