import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import s from './App.module.css';
import SearchBar from './components/SearchBar/SearchBar';
import Card from './components/Card/Card';
import axios from 'axios';
import loadingGif from './img/loadingGif.gif';
import { City, Flags} from './extras/types'


export default function App() {

  const [choosenCities, setChoosenCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [images, setImages] = useState({})

  // This hook set the city of the user
  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    let flags: Flags = {};
    require.context('./img/svg', false, /\.(svg)$/).keys().forEach((item, index) => { flags[item.replace('./', '')] = require.context('./img/svg', false, /\.(svg)$/)(item) });
    setImages(flags);
    async function getUserCity() {
      try {
        const locationInfo = await axios.get('https://geolocation-db.com/json/', { cancelToken: source.token });
        const weatherInfo = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${locationInfo.data.city}&appid=${process.env.REACT_APP_API_KEY}`)
        const { weather, main, wind } = weatherInfo.data
        setChoosenCities([...choosenCities, { name: locationInfo.data.city, country: locationInfo.data.country_name, flag: flags[`${locationInfo.data.country_code.toLowerCase()}.svg`].default, weather: weather.description, weatherIconId: weather.icon, temperature: main.temp, windSpeed: wind.speed }])
      } catch (e) {
        if (e instanceof Error) {
          if (e.message !== "Unmounted") return;
        }
      }
      setLoading(false)
    }
    getUserCity();
    return () => source.cancel("Unmounted");
  }, [])


  return (
    <>
      {
        loading ?
          <div className={s.container}>
            <div className={s.content}>
              <img className={s.loading} src={loadingGif} alt='loadingGif'></img>
            </div>
          </div>
          :
          <div className={s.appContainer}>
            <SearchBar></SearchBar>
            {/* {
              choosenCities ? 
              :

            } */}
            {/* <SearchBar
          onSearch={(ciudad) => alert(ciudad)}
        /> */}
            <div className={s.cardsContainer}>
              {
                choosenCities.length ?
                  <>
                    {
                      choosenCities.map((e: City, index) =>
                        <Card key={index} name={e.name} country={e.country} flag={e.flag} weather={e.weather} weatherIconId={e.weatherIconId} temperature={e.temperature} windSpeed={e.windSpeed}></Card>
                      )
                    }
                  </>
                  :
                  <p className='bold'>No cities found</p>
              }
            </div>



            {/* <div>
        <div className={s.contenedor}>
          <Card></Card>
          </div>
      </div> */}



            {/* { cities.map(city => (
      <Card 
        max={city.main.temp_max}
        min={city.main.temp_min}
        name={city.name}
        img={city.weather[0].icon}
        onClose={() => alert(city.name)}></Card>
    ))
    } */}


          </div>
      }
    </>
  )
}