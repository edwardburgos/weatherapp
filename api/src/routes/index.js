const { Router } = require('express');
const axios = require('axios').default;
const { Country, City, State } = require('../db.js');
const countries = require('../extras/countries')
const { Op } = require('sequelize');
const router = Router();


// This route allows us to get the cities by name
router.get('/cities', async (req, res, next) => {
    try {
        let {name, country} = req.query
        let cities = {data: ''}
        if (country) {
            country = await Country.findOne({where: {code: country}})
            cities = await City.findAll({ attributes: ['nameLower', 'nameNormal', 'stateId', 'countryId'], where: {nameLower: { [Op.substring]: name }, countryId: country.id}, include: [{ model: Country, attributes: ['code', 'nameNormal'] }, {model: State, attributes: ['nameNormal']}]})
        } else {
            cities = await City.findAll({ attributes: ['nameLower', 'nameNormal', 'stateId', 'countryId'], where: {nameLower: { [Op.substring]: name }}, include: [{ model: Country, attributes: ['code', 'nameNormal'] }, {model: State, attributes: ['nameNormal']}]})
        }
        if (cities) {
            const filterCities = cities.filter(e => e.nameLower === name).length ? cities.filter(e => e.nameLower === name) : cities;
            res.send([...new Set(filterCities.map(e => JSON.stringify({name: e.nameNormal, state: e.state ? e.state.nameNormal : null, country: {code: e.country.code, name: e.country.nameNormal}})))].map(e => JSON.parse(e)).slice(0, 10))
        } else { res(404).send(`There is no city called ${name}`); }
    } catch (e) {
        console.log(e)
        next();
    } 
})

// This route allows us to get all the countries
router.get('/countries', async (req, res, next) => {
    try {
        const countries = await Country.findAll();
        res.send(countries.map(e => {return {name: e.nameNormal, code: e.code}}))
    } catch (e) {
        console.log(e)
        next
    }
});


module.exports = router;