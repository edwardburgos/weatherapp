//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { City, Country, State } = require('./src/db.js');
const axios = require('axios')
const fs = require('fs')

// Syncing all the models at once.
conn.sync({ force: false }).then(async () => { // force: false > La información de la base de datos no se borrará al ejecutar el servidor
  // await conn.query("ALTER SEQUENCE dogs_id_seq RESTART WITH 265;") > This line allows us to start the registers with id 265
  if (!(await Country.findAll()).length && !(await State.findAll()).length && !(await City.findAll()).length) { // No existe en base de datos 
    try {
      // Registro Countries
      const countries = fs.readFileSync('./src/extras/countries.js', 'utf8')
      await Country.bulkCreate(JSON.parse(countries).map(e => { return { nameLower: e.name.toLowerCase(), nameNormal: e.name, code: e.code, codeBig: e.code3} }));

      // Registro States
      const states = fs.readFileSync('./src/extras/countryStates.js', 'utf-8')
      JSON.parse(states).forEach(async e => {
        try {
          const country = await Country.findOne({where: {codeBig: e.iso3}})
          if (country) {
            const countryId = country.id;
            e.states.forEach(async e => {
                const state = await State.create({nameLower: e.name.toLowerCase(), nameNormal: e.name, code: e.state_code, countryId: countryId})
            })
          }
        } catch (e) {
          console.log(e)
        }
      })

      // Registro Cities
      const cities = fs.readFileSync('./src/extras/countryStateCities.js', 'utf-8')
      //[{"name":"Ḩeşār-e Sefīd","state":"","country":"IR"},
      JSON.parse(cities).forEach(async e => { 
        try {
          const country = await Country.findOne({where: {code: e.country}})
          let state = ''
          if (e.state) {state = await State.findOne({where: {code: e.state, countryId: country.id}})}
          await City.create({nameLower: e.name.toLowerCase(), nameNormal: e.name, stateId: state ? state.id : null, countryId: country.id})
        } catch (err) {
          console.log('ROMEO', e.name, e.state)
          console.log(err)
        }
      });

      // let temperaments = [];
      // const response = await axios.get('https://api.thedogapi.com/v1/breeds');
      // response.data.forEach((e) => {
      //   var temperamentsFound = e.temperament;
      //   if (!temperamentsFound) return;
      //   var newArray = temperamentsFound.split(', ');
      //   temperaments = [...temperaments, ...newArray];
      // });
      // temperaments = [...new Set(temperaments)]
      // await Temperament.bulkCreate(temperaments.sort().map((e) => { return { name: e } }));
      // response.data.forEach(async (e) => {
      //   const values = [e.height.metric, e.weight.metric, e.life_span].map((e) => {
      //     const separated = e.split(' ')
      //     if (separated.length === 1) { return isNaN(parseInt(e)) ? [null, null] : [null, parseInt(e)] }
      //     if (separated.length === 2) { return [null, parseInt(separated[0])] }
      //     if (separated.length >= 3) { return [isNaN(parseInt(separated[0])) ? null : parseInt(separated[0]), isNaN(parseInt(separated[2])) ? null : parseInt(separated[2])] }
      //   })
      //   const dog = await Dog.create({
      //     name: e.name,
      //     heightmax: values[0][1],
      //     heightmin: values[0][0],
      //     weightmax: values[1][1],
      //     weightmin: values[1][0],
      //     lifespanmax: values[2][1],
      //     lifespanmin: values[2][0],
      //     image: e.image.url,
      //     origin: e.origin ? e.origin : null,
      //     breed_group: e.breed_group ? e.breed_group : null,
      //     bred_for: e.bred_for ? e.bred_for : null
      //   })
      //   if (e.temperament) {
      //     e.temperament.split(', ').forEach(async (e) => {
      //       var foundTemperament = await Temperament.findOne({ where: { name: e } });
      //       if (foundTemperament) dog.addTemperament(foundTemperament);
      //     });
      //   }
      // })
    } catch (e) {
      console.log('Se produjo este error al cargar la base de datos', e)
    }
  }
  server.listen(3001, () => {
    console.log('%s listening at 3001'); // eslint-disable-line no-console
  });
  //   (async () => {
  //   await sequelize.conn.sync();
  //   sequelize.query("SELECT setval('dogs_id_seq', 264);")
  // })()
});
