import React, { useState } from 'react';
import s from './Result.module.css'
import axios from 'axios';
import { City, ResultProps, Flags } from '../../extras/types';
import { modifyChoosenCities, modifyModalState} from '../../actions';
import { useDispatch, useSelector } from 'react-redux';

export default function Result({ searchResult, margin}: ResultProps) {

  const choosenCities = useSelector((state: { choosenCities: City[] }) => state.choosenCities)
  const flags = useSelector((state: { flags: Flags }) => state.flags)
  const dispatch = useDispatch();

//   export type Country = {
//     code: string,
//     name: string
// }

// export type SearchResult = {
//     name: string,
//     state: string,
//     country: Country
// }


  async function add() {
    try {
      let stateCode = ''
      if (searchResult.state) {
        const code = await axios.get(`http://localhost:3001/stateCode/?countryCode=${searchResult.country.code}&stateName=${searchResult.state}`)
        stateCode = code.data
      }
      const citieInfo = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchResult.name},${stateCode ? stateCode : ''},${searchResult.country.code}&appid=${process.env.REACT_APP_API_KEY}`)
      const { weather, main, wind } = citieInfo.data
      
      dispatch(modifyChoosenCities([...choosenCities, { name: citieInfo.data.city, country: citieInfo.data.country_name, flag: flags[`${citieInfo.data.country_code.toLowerCase()}.svg`].default, weather: weather ? weather[0].description.slice(0, 1).toUpperCase() + weather[0].description.slice(1).toLowerCase() : '', weatherIcon: `http://openweathermap.org/img/w/${weather[0].icon}.png`, temperature: main.temp, windSpeed: wind.speed }]))  
      dispatch(modifyModalState(false))
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className={`${s.container} ${margin ? '' : 'mb-0'}`}>
      <span className='bold'>{searchResult.name}</span>
      <div className='mb-2'>
      {
        searchResult.state ?
        <><span>{`${searchResult.state}, `}</span><span>{searchResult.country.name}</span></>
        : 
        <><span>{searchResult.country.name}</span></>
      }
      </div>
      <img className={s.countryFlag} src={flags[`${searchResult.country.code.toLowerCase()}.svg`].default} alt='Country flag'></img>
      <button className='btn btn-primary w-100' onClick={() => add()}>Add</button>
    </div>

  )
};