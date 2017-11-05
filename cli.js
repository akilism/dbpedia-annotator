const { getPerson } = require('./index');

async function main(name) {
  const result = await getPerson(name);
  Object.values(result).map(itm => {
    console.log(`
URI: ${Array.isArray(itm.person.value)
      ? itm.person.value.join(', ')
      : itm.person.value}
Label: ${Array.isArray(itm.label.value)
      ? itm.label.value.join(', ')
      : itm.label.value}
Name: ${Array.isArray(itm.name.value)
      ? itm.name.value.join(', ')
      : itm.name.value}
Description: ${itm.description
      ? `${Array.isArray(itm.description.value)
          ? itm.description.value.join(', ')
          : itm.description.value}`
      : 'none'}
Subject: ${itm.subject
      ? `${Array.isArray(itm.subject.value)
          ? itm.subject.value
              .map(v => {
                return v
                  .replace('http:', '')
                  .split(':')
                  .filter((_, i) => i > 0)
                  .sort()
                  .join(':');
              })
              .join(', ')
          : itm.subject}`
      : 'none'}
Comment: ${Array.isArray(itm.comment.value)
      ? itm.comment.value.join(', ')
      : itm.comment.value}
Abstract: ${Array.isArray(itm.abstract.value)
      ? itm.abstract.value.join(', ')
      : itm.abstract.value}
    `);
  });
}

main(process.argv[2]);
