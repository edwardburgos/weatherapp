import React, { useState } from 'react';
import s from './Card.module.css'
import { City } from '../../extras/types'
import temperatureIcon from '../../temperature.svg';
import windSpeedIcon from '../../img/others/windSpeed.png';


export default function Card({ name, country, flag, weather, weatherIcon, temperature, windSpeed, state }: City) {
  // acá va tu código


  return (
    <div className={s.card}>
      <div className='w-100'>
        <h2 className='text-center mb-3'>{name}</h2>
        <div className={s.infoSection}>
          <div className={s.iconContainer}>
            <img className={s.countryFlag} src={flag} alt='Country flag'></img>
          </div>

          <div className={s.detailsContainer}>
            <label className='bold'>Location</label>
            <div>
              {state ? <span>{`${state}, `}</span> : null}
              <span className='mb-0'>{country}</span>
            </div>
          </div>
        </div>
        <div className={s.infoSection}>
          <div className={s.iconContainer}>
            <img className={s.icon} src={weatherIcon} alt='Weather representation'></img>
          </div>
          <div className={s.detailsContainer}>
            <label className='bold'>Weather</label>
            <p className='mb-0'>{weather}</p>
          </div>
        </div>
        <div className={s.infoSection}>
          <div className={s.iconContainer}>
            <img className={s.icon} src={temperatureIcon} alt='Temperature'></img>
          </div>
          <div className={s.detailsContainer}>
            <label className='bold'>Temperature</label>
            <p className='mb-0'>{`${temperature} K | ${Math.round(((((temperature - 273.15) * 1.8) + 32) + Number.EPSILON) * 100) / 100} °F | ${Math.round((temperature - 273.15) * 100) / 100} °C`}</p>
          </div>
        </div>
        <div className={s.infoSection}>
          <div className={s.iconContainer}>
            <img className={s.icon} src={windSpeedIcon} alt='Wind speed'></img>
          </div>
          <div className={s.detailsContainer}>
            <label className='bold'>Wind speed</label>
            <p className='mb-0'>{windSpeed} meter/sec</p>
          </div>
        </div>
      </div>
    </div>
  )
};