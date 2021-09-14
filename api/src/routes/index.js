const { Router } = require('express');
const axios = require('axios').default;
const { Country, City, State } = require('../db.js');
const countries = require('../extras/countries')
const { Op } = require('sequelize');
const router = Router();

router.get('/countries', async (req, res, next) => {
    try {
        const countries = await Country.findAll();
        res.send(countries)
    } catch (e) {
        console.log(e)
        next
    }
    
});

module.exports = router;