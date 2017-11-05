const SparqlClient = require('sparql-client');
const endPoint = 'http://dbpedia.org/sparql';

const PREFIX = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX : <http://dbpedia.org/resource/>
PREFIX dbpedia2: <http://dbpedia.org/property/>
PREFIX dbpedia: <http://dbpedia.org/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>`;

function escape(val) {
  return val
    .trim()
    .replace('"', '\\"')
    .replace(/\(/, '\\(')
    .replace(/\)/, '\\)')
    .replace('*', '\\*')
    .replace('.', '\\.')
    .replace('+', '\\+')
    .replace(':', '\\:')
    .replace('?', '\\?')
    .replace('@', '\\@')
    .replace('$', '\\$');
}

function noneMatch(a, b) {
  if (Array.isArray(a)) {
    return a.filter(i => i === b).length === 0;
  } else {
    return a !== b;
  }
}

function runQuery(type, query) {
  return new Promise((resolve, reject) => {
    const client = new SparqlClient(endPoint);
    console.log('Query to ' + endPoint);
    // console.log('Query: ' + query);

    client.query(query).execute(function(error, response) {
      if (response.results.bindings.length === 0) {
        resolve(null);
      }

      // combine identical records.
      // TODO: refactor this to use Sets.
      const results = response.results.bindings.reduce((acc, itm) => {
        const key = itm[type].value;
        if (acc[key]) {
          const mergeItm = { ...acc[key] };
          Object.keys(itm).forEach(k => {
            if (mergeItm[k] && noneMatch(mergeItm[k].value, itm[k].value)) {
              if (Array.isArray(mergeItm[k].value)) {
                mergeItm[k].value.push(itm[k].value);
              } else {
                mergeItm[k].value = [mergeItm[k].value, itm[k].value];
              }
            } else {
              mergeItm[k] = { ...itm[k] };
            }
          });
          return Object.assign({}, acc, { [key]: { ...mergeItm } });
        } else {
          return Object.assign({}, acc, { [key]: { ...itm } });
        }
      }, {});

      resolve(results);
    });
  });
}

function getPerson(name) {
  const query = `${PREFIX}
  SELECT DISTINCT
    ?abstract ?birthDate ?comment
    ?description ?label ?name
    ?nationality ?person ?subject
  WHERE {
    ?person a foaf:Person .
    ?person foaf:name ?name .
    ?person rdfs:label ?label .
    ?person dbo:abstract ?abstract .
    OPTIONAL { ?person dbo:birthDate ?birthDate } .
    OPTIONAL { ?person dbp:nationality ?nationality } .
    OPTIONAL { ?person dct:subject ?subject } .
    OPTIONAL { ?person dct:description ?description }
    OPTIONAL { ?person rdfs:comment ?comment . FILTER (LANG(?comment) = 'en') } .
    FILTER (LANG(?name) = 'en') .
    FILTER (LANG(?abstract) = 'en') .
    FILTER (regex(?label, "${escape(name)}", "i") AND LANG(?label) = 'en')
  }
  ORDER BY $label
  `;

  return runQuery('person', query);
}

function getLocation(name) {
  const query = `${PREFIX}
  SELECT DISTINCT
    ?abstract ?comment ?country
    ?geometry ?label ?location
    ?name ?subject ?isPartOf
  WHERE {
    ?location a dbo:Location .
    ?location foaf:name ?name .
    ?location rdfs:label ?label .
    ?location dbo:abstract ?abstract .
    OPTIONAL { ?location geo:geometry ?geometry } .
    OPTIONAL { ?location dbo:country ?country } .
    OPTIONAL { ?location dct:subject ?subject } .
    OPTIONAL { ?location dbo:isPartOf ?isPartOf } .
    OPTIONAL { ?location rdfs:comment ?comment . FILTER (LANG(?comment) = 'en') } .
    FILTER (LANG(?name) = 'en') .
    FILTER (LANG(?abstract) = 'en') .
    FILTER (regex(?label, "${escape(name)}", "i") AND LANG(?label) = 'en')
  }
  ORDER BY $label
  `;

  return runQuery('location', query);
}

function getOrganization(name) {
  const query = `${PREFIX}
  SELECT DISTINCT
    ?abstract ?comment ?foundingYear
    ?industry ?label ?location
    ?locationCity ?locationCountry ?name
    ?organization ?subject
  WHERE {
    ?organization a dbo:Organisation .
    ?organization foaf:name ?name .
    ?organization rdfs:label ?label .
    ?organization dbo:abstract ?abstract .
    OPTIONAL { ?organization dbo:location ?location } .
    OPTIONAL { ?organization dbo:locationCity ?locationCity } .
    OPTIONAL { ?organization dbo:locationCountry ?locationCountry } .
    OPTIONAL { ?organization dbo:foundingYear ?foundingYear } .
    OPTIONAL { ?organization dbo:industry ?industry } .
    OPTIONAL { ?organization dct:subject ?subject } .
    OPTIONAL { ?organization rdfs:comment ?comment . FILTER (LANG(?comment) = 'en') } .
    FILTER (LANG(?name) = 'en') .
    FILTER (LANG(?abstract) = 'en') .
    FILTER (regex(?label, "${escape(name)}", "i") AND LANG(?label) = 'en')
  }
  ORDER BY $label
  `;
  return runQuery('organization', query);
}

module.exports = {
  getLocation,
  getOrganization,
  getPerson
};
