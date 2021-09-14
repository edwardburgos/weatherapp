const { Router } = require('express');
const axios = require('axios').default;
const { Country, City, State } = require('../db.js');
const countries = require('../extras/countries')
const { Op } = require('sequelize');
const router = Router();


// This route allows us to get the cities by name
router.get('/cities', async (req, res, next) => {
    try {
        const cities = await City.findAll({ attributes: ['nameLower', 'nameNormal', 'stateId', 'countryId'], where: {nameLower: { [Op.substring]: req.query.name}}})
        if (cities) {
            const filterCities = cities.filter(e => e.nameLower === req.query.name).length ? cities.filter(e => e.nameLower === req.query.name) : cities;
            res.send([...new Set(filterCities.map(e => JSON.stringify({nameNormal: e.nameNormal, stateId: e.stateId, countryId: e.countryId})))].map(e => JSON.parse(e)).slice(0, 10))
        } else { res(404).send(`There is no city called ${req.query.name}`); }
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