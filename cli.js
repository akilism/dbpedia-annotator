const { getLocation, getOrganization, getPerson } = require('./index');

function displayOptionalItem(key, itm) {
  return `${itm[key]
    ? `${Array.isArray(itm[key].value)
        ? itm[key].value
            .map(v => {
              return v
                .replace('http:', '')
                .split(':')
                .filter((_, i) => i > 0)
                .sort()
                .join(':');
            })
            .join(', ')
        : itm[key].value}`
    : 'none'}`;
}

function displayItem(key, itm) {
  return `${Array.isArray(itm[key].value)
    ? itm[key].value.join(', ')
    : itm[key].value}`;
}

const abstractItem = displayItem.bind(null, 'abstract');
const labelItem = displayItem.bind(null, 'label');
const locationItem = displayItem.bind(null, 'location');
const nameItem = displayItem.bind(null, 'name');
const organizationItem = displayItem.bind(null, 'organization');
const personItem = displayItem.bind(null, 'person');

const birthDateItem = displayOptionalItem.bind(null, 'comment');
const commentItem = displayOptionalItem.bind(null, 'comment');
const countryItem = displayOptionalItem.bind(null, 'country');
const descriptionItem = displayOptionalItem.bind(null, 'description');
const foundingYearItem = displayOptionalItem.bind(null, 'foundingYear');
const geometryItem = displayOptionalItem.bind(null, 'geometry');
const industryItem = displayOptionalItem.bind(null, 'industry');
const isPartOfItem = displayOptionalItem.bind(null, 'isPartOf');
const locationCityItem = displayOptionalItem.bind(null, 'locationCity');
const locationCountryItem = displayOptionalItem.bind(null, 'locationCountry');
const nationalityItem = displayOptionalItem.bind(null, 'nationality');
const optionalLocationItem = displayOptionalItem.bind(null, 'location');
const subjectItem = displayOptionalItem.bind(null, 'subject');

function displayLocation(result) {
  Object.values(result).map(itm => {
    console.log(`
URI: ${locationItem(itm)}
Label: ${labelItem(itm)}
Name: ${nameItem(itm)}
Country: ${countryItem(itm)}
Geometry: ${geometryItem(itm)}
Is Part Of: ${isPartOfItem(itm)}
Subject: ${subjectItem(itm)}
Comment: ${commentItem(itm)}
Abstract: ${abstractItem(itm)}
    `);
  });
}

function displayPerson(result) {
  Object.values(result).map(itm => {
    console.log(`
    URI: ${personItem(itm)}
    Label: ${labelItem(itm)}
    Name: ${nameItem(itm)}
    Birth Date: ${birthDateItem(itm)}
    Nationality: ${nationalityItem(itm)}
    Description: ${descriptionItem(itm)}
    Subject: ${subjectItem(itm)}
    Comment: ${commentItem(itm)}
    Abstract: ${abstractItem(itm)}
    `);
  });
}

function displayOrganization(result) {
  Object.values(result).map(itm => {
    console.log(`
    URI: ${organizationItem(itm)}
    Label: ${labelItem(itm)}
    Name: ${nameItem(itm)}
    Location: ${optionalLocationItem(itm)}
    City: ${locationCityItem(itm)}
    Country: ${locationCountryItem(itm)}
    Industry: ${industryItem(itm)}
    Founding Year: ${foundingYearItem(itm)}
    Subject: ${subjectItem(itm)}
    Comment: ${commentItem(itm)}
    Abstract: ${abstractItem(itm)}
    `);
  });
}

function helpMessage() {
  console.log(`
  🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝
  🐝    node cli <name> <person, location, or organization>  🐝
  🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝
  `);
}

async function main(name, type) {
  let result;

  if (!name || !type) {
    helpMessage();
    process.exit(-1);
  }

  switch (type.toLowerCase()) {
    case 'location':
      result = await getLocation(name);
      displayLocation(result);
      break;
    case 'organization':
      result = await getOrganization(name);
      // console.log(result);
      displayOrganization(result);
      break;
    case 'person':
      result = await getPerson(name);
      displayPerson(result);
      break;
    default:
      helpMessage();
      break;
  }
}

main(process.argv[2], process.argv[3]);
