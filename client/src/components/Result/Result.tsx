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
      const citieInfo = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchResult.name},${searchResult.state ? searchResult.state.code : ''},${searchResult.country.code}&appid=${process.env.REACT_APP_API_KEY}`)
      const { weather, main, wind } = citieInfo.data
      let currentStorage = JSON.parse(localStorage.getItem('choosenCities') || '[]')
     // currentStorage.filter(e => {e[0] === })
      localStorage.setItem('choosenCities', JSON.stringify([[searchResult.name, searchResult.state ? searchResult.state.code : '', searchResult.country.code], ...currentStorage]))
      dispatch(modifyChoosenCities([{ name: searchResult.name, country: searchResult.country.name, flag: flags[`${searchResult.country.code.toLowerCase()}.svg`].default, weather: weather[0].description.slice(0, 1).toUpperCase() + weather[0].description.slice(1).toLowerCase(), weatherIcon: `http://openweathermap.org/img/w/${weather[0].icon}.png`, temperature: main.temp, windSpeed: wind.speed,  state: searchResult.state ? searchResult.state.name : ''}, ...choosenCities])) 
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
        <><span>{`${searchResult.state.name}, `}</span><span>{searchResult.country.name}</span></>
        : 
        <><span>{searchResult.country.name}</span></>
      }
      </div>
      <img className={s.countryFlag} src={flags[`${searchResult.country.code.toLowerCase()}.svg`].default} alt='Country flag'></img>
      <button className='btn btn-primary w-100' onClick={() => add()}>Add</button>
    </div>

  )
};