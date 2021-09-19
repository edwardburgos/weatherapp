import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import s from './App.module.css';
import SearchBar from './components/SearchBar/SearchBar';
import Card from './components/Card/Card';
import axios from 'axios';
import loadingGif from './img/others/loadingGif.gif';
import earthGif from './img/others/earthGif.gif';
import { City, Flags } from './extras/types'
import { modifyChoosenCities, setCountries, setFlags } from './actions';
import { useDispatch, useSelector } from 'react-redux';



export default function App() {

  const choosenCities = useSelector((state: { choosenCities: City[] }) => state.choosenCities)

  const [loading, setLoading] = useState<boolean>(true);
  const [images, setImages] = useState({})

  const dispatch = useDispatch();

  // This hook set the city of the user
  useEffect(() => {
    //dispatch(console.log(cities.cities[0]))
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    let images: Flags = {};
    require.context('./img/svg', false, /\.(svg)$/).keys().forEach((item, index) => { images[item.replace('./', '')] = require.context('./img/svg', false, /\.(svg)$/)(item) });
    dispatch(setFlags(images))
    async function getInfo() {
      try {
        // Get user data
        if (!localStorage.getItem("choosenCities")) {
          const locationInfo = await axios.get('https://geolocation-db.com/json/', { cancelToken: source.token });
          const stateCode = await axios.get(`http://localhost:3001/stateCode?countryCode=${locationInfo.data.country_code}&stateName=${locationInfo.data.state}`, { cancelToken: source.token } )
          const weatherInfo = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${locationInfo.data.city},${/^[A-Z]+$/.test(stateCode.data) ? stateCode.data : ''},${locationInfo.data.country_code}&appid=${process.env.REACT_APP_API_KEY}`)
          const { weather, main, wind } = weatherInfo.data
          dispatch(modifyChoosenCities([{ name: locationInfo.data.city, country: locationInfo.data.country_name, flag: images[`${locationInfo.data.country_code.toLowerCase()}.svg`].default, weather: weather[0].description.slice(0, 1).toUpperCase() + weather[0].description.slice(1).toLowerCase(), weatherIcon: `http://openweathermap.org/img/w/${weather[0].icon}.png`, temperature: main.temp, windSpeed: wind.speed, state: locationInfo.data.state ? locationInfo.data.state : '' }, ...choosenCities]));
          localStorage.setItem('choosenCities', JSON.stringify([[locationInfo.data.city, /^[A-Z]+$/.test(stateCode.data) ? stateCode.data : '', locationInfo.data.country_code]]));
        } else {
          let localChoosenCities: City[] = []
          const localItems = JSON.parse(localStorage.getItem("choosenCities") || '[]')
          for (const e of localItems) {
            const weatherInfo = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${e[0]},${e[1]},${e[2]}&appid=${process.env.REACT_APP_API_KEY}`)
            const stateCountryName = await axios.get(`http://localhost:3001/stateCountryName?countryCode=${e[2]}&stateCode=${e[1]}`)
            const { weather, main, wind } = weatherInfo.data
            localChoosenCities = [...localChoosenCities, { name: e[0], country: stateCountryName.data.countryName, flag: images[`${e[2].toLowerCase()}.svg`].default, weather: weather[0].description.slice(0, 1).toUpperCase() + weather[0].description.slice(1).toLowerCase(), weatherIcon: `http://openweathermap.org/img/w/${weather[0].icon}.png`, temperature: main.temp, windSpeed: wind.speed, state: stateCountryName.data.stateName }];
          }
          dispatch(modifyChoosenCities(localChoosenCities))
        }

        // Get countries
        const countries = await axios.get('http://localhost:3001/countries', { cancelToken: source.token })
        dispatch(setCountries(countries.data))

        // The loading state change
        setLoading(false)
      } catch (e) {
        if (e instanceof Error) {
          if (e.message !== "Unmounted") return;
        }
      }
    }
    getInfo();
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
            <img className={s.earthGif} src={earthGif} alt='earthGif'></img>
            <SearchBar></SearchBar>
            {/* {
              choosenCities ? 
              :

            } */}
            {/* <SearchBar
          onSearch={(ciudad) => alert(ciudad)}
        /> */}
            <div className={s.searchContent}>
              <div className={s.cardsContainer}>
                {
                  choosenCities.length ?
                    <>
                      {
                        choosenCities.map((e: City, index) =>
                          <Card key={index} name={e.name} country={e.country} flag={e.flag} weather={e.weather} weatherIcon={e.weatherIcon} temperature={e.temperature} windSpeed={e.windSpeed} state={e.state}></Card>
                        )
                      }
                    </>
                    :
                    <p className='bold'>No cities found</p>
                }
              </div>
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