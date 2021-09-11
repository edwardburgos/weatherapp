import React, {useState} from 'react';
import s from './Card.module.css'
import { City } from '../../extras/types'


export default function Card({ name, country, flag, weather, weatherIconId, temperature, windSpeed }: City) {
  // acá va tu código
  

  return (
    <div className={s.card}>
      <h2 className='text-center'>{name}</h2>
      <div className={s.countryInfo}>
      <img className={s.countryFlag} src={flag} alt='Country flag'></img>
        <p className='bold'>{country}</p>
      </div>
      <h1>{country}</h1>


     
      <h1>{weather}</h1>
      <h1>{weatherIconId}</h1>
      <h1>{temperature}</h1>
      <h1>{windSpeed}</h1>

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