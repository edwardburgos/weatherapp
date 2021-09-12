import React, { useState } from 'react';
import s from './Card.module.css'
import { City } from '../../extras/types'


export default function Card({ name, country, flag, weather, weatherIcon, temperature, windSpeed }: City) {
  // acá va tu código


  return (
    <div className={s.card}>
      <h2 className='text-center mb-3'>{name}</h2>
      <div className={s.countryInfo}>
        <div className={s.iconContainer}>
          <img className={s.countryFlag} src={flag} alt='Country flag'></img>
        </div>

        <div className={s.detailsContainer}>
          <label className='bold'>Country</label>
          <p className='mb-0'>{country}</p>
        </div>
      </div>
      <div className={s.weatherInfo}>
        <div className={s.iconContainer}>
          <img className={s.weatherIcon} src={weatherIcon} alt='Weather representation'></img>
        </div>
        <div className={s.detailsContainer}>
          <label className='bold'>Weather</label>
          <p className='mb-0'>{weather}</p>
        </div>
      </div>


      <label className='bold'>Temperature</label>
      <p>{temperature}</p>

      <label className='bold'>Wind speed</label>
      <p className='mb-0'>{windSpeed} meter/sec</p>

      {/* <div className={styles.card}>
      <button onclick={props.onClose} className={styles.closeButton}>x</button>
      <h2>{props.name}</h2>
      <div className={styles.flex}>
        <div className={styles.firstElement}>
          <div className={`${styles.flex} ${styles.subtitles}`}>
            <span>Min</span>
            <span>Max</span>
          </div>
          <div className={`${styles.flex} ${styles.temperatures}`}>
            <span>{props.min}</span>
            <span>{props.max}</span>
          </div>
        </div>
        <div className={styles.secondElement}>
          <img src={"http://openweathermap.org/img/wn/" + props.img + "@2x.png"} alt={"Imagen" + props.img}></img>
        </div>
      </div>

    </div>
    <h1>HOLA</h1> */}
    </div>
  )
};