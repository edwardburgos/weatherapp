const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { City, Country, State } = require('./src/db.js');
const fs = require('fs')

conn.sync({ force: false }).then(async () => { 
  if (!(await Country.findAll()).length && !(await State.findAll()).length && !(await City.findAll()).length) { 
    try {

      // Insert countries
      const countries = fs.readFileSync('./src/extras/countries.js', 'utf8')
      await Country.bulkCreate(JSON.parse(countries).map(e => { return { nameLower: e.name.toLowerCase(), nameNormal: e.name, code: e.code, codeBig: e.code3 } }));

      // Insert states
      const states = fs.readFileSync('./src/extras/countryStates.js', 'utf-8')
      await new Promise((resolve, reject) => {
        JSON.parse(states).forEach(async (e, index) => {
          try {
            const country = await Country.findOne({ where: { codeBig: e.iso3 } })
            if (country) {
              const countryId = country.id;
              await new Promise((resolve, reject) => {
                e.states.forEach(async (e, index) => {
                  try {
                    await State.create({ nameLower: e.name.toLowerCase(), nameNormal: e.name, code: e.state_code, countryId: countryId })
                    if (index === e.states.length - 1) resolve();
                  }
                  catch (e) {
                    console.log(e)
                  }
                });
              });
            }
            if (index === JSON.parse(states).length - 1) resolve();
          } catch (e) {
            console.log(e)
          }
        });
      });

      // Insert cities
      const cities = fs.readFileSync('./src/extras/countryStateCities.js', 'utf-8')
      await new Promise((resolve, reject) => {
        JSON.parse(cities).forEach(async e => {
          try {
            const country = await Country.findOne({ where: { code: e.country } })
            let state = ''
            if (e.state) { state = await State.findOne({ where: { code: e.state, countryId: country.id } }) }
            await City.create({ nameLower: e.name.toLowerCase(), nameNormal: e.name, stateId: state ? state.id : null, countryId: country.id })
            if (index === JSON.parse(cities).length - 1) resolve();
          } catch (err) {
            console.log(err)
          }
        });
      });
    } catch (e) {
      console.log('Se produjo este error al cargar la base de datos', e)
    }
  }
  server.listen(3001, () => {
    console.log('%s listening at 3001');
  });
});
