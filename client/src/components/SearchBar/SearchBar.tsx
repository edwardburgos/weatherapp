import React, { useState, useEffect } from 'react';
import s from './SearchBar.module.css';
import { Form, Modal } from 'react-bootstrap';
import axios, { CancelToken } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { modifyChoosenCities, modifyModalState } from '../../actions';
import { City, Flags, AvailableCity, Country, SearchResult } from '../../extras/types';
import Result from '../Result/Result'
import loadingHorizontal from '../../img/others/loadingHorizontalGif.gif';
import closeCircleOutline from "../../img/icons/close-circle-outline.svg";
import { showMessage } from '../../extras/functions';

export default function SearchBar() {

  const [source, setSource] = useState<{ token: CancelToken, cancel: (() => void) } | string>('')
  const countries = useSelector((state: { countries: Country[] }) => state.countries)
  // const [countries, setCountries] = useState<Country[]>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [buttonState, setButtonState] = useState(true)
  const [buttonContent, setButtonContent] = useState('Search')
  const [city, setCity] = useState('')
  const [state, setState] = useState(['code', 'name'])
  const [country, setCountry] = useState(['app', 'default', 'name'])
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch();

  const modalState = useSelector((state: { modalState: boolean }) => state.modalState)
  const choosenCities = useSelector((state: { choosenCities: City[] }) => state.choosenCities)
  const flags = useSelector((state: { flags: Flags }) => state.flags)


  useEffect(() => {
    //if (country !== 'default') setAvailableCities(countriesCities.filter(f => f.country === country)[0]['cities'])
  }, [country])




  async function searchCity(cityName: string, country: string[]) {
    let cities: { data: SearchResult[] } = { data: [{ name: '', state: { code: '', name: '' }, country: { code: '', name: '' } }] };
    // if (typeof cancel !== 'string' && cancel !== undefined) { 
    // //   console.log('olor', cancel)
    // //   console.log('sabor', typeof cancel )
    //   cancel()
    // }
    if (typeof source !== 'string') { source.cancel(); } //No es necesario cancelar en cada una solo en la última cuando 
    const CancelToken = axios.CancelToken;
    const newSource = CancelToken.source();
    setSource(newSource)
    if (country[1] !== 'default' && country[0] === 'user') {
      cities = await axios.get(`http://localhost:3001/cities?name=${cityName}&country=${country[1]}`, { cancelToken: newSource.token })
    } else {
      cities = await axios.get(`http://localhost:3001/cities?name=${cityName}`, { cancelToken: newSource.token })
    }
    if (cities.data.length === 1 && cities.data[0].name.toLowerCase() === cityName) { if (country[0] !== 'user') { setCountry(['app', cities.data[0].country.code, cities.data[0].country.name]); }; cities.data[0].state ? setState([cities.data[0].state.code, cities.data[0].state.name]) : setState(['code', 'name']); setButtonContent('Add'); setButtonState(false) }
    else {
      if (cities.data.length) {
        if (country[0] !== 'user') { setCountry(['app', 'default', 'name']) } setButtonContent('Search'); setResults(cities.data); setButtonState(false)
      } else { setButtonContent('No cities found'); setButtonState(true) }

    }

    // const filterInfo = info.filter((e: AvailableCity) => e.name.toLowerCase() === cityName.toLowerCase())
    // if (filterInfo.length === 1) { 
    //   console.log(filterInfo)
    //   return setButtonContent('Add');



    // } else {
    //   const results = info.filter((e: AvailableCity) => e.name.toLowerCase().includes(cityName)).length
    //   if (results === 1) return setButtonContent('Add')
    //   if (results) return setButtonContent('Search');
  }

  async function add() {
    try {
      const citieInfo = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},${state[0] !== 'code' ? state[0] : ''},${country[1]}&appid=${process.env.REACT_APP_API_KEY}`)
      const { weather, main, wind } = citieInfo.data
      let currentStorage = JSON.parse(localStorage.getItem('choosenCities') || '[]')
      if (currentStorage.filter((e: string[]) => e[0] === citieInfo.data.name && e[1] === (state[0] !== 'code' ? state[0] : '') && e[2] === country[1]).length) {
        showMessage('This city is already in your list')
      } else {
        localStorage.setItem('choosenCities', JSON.stringify([[citieInfo.data.name, state[0] !== 'code' ? state[0] : '', country[1]], ...currentStorage]))
        dispatch(modifyChoosenCities([{ name: citieInfo.data.name, country: country[2], flag: flags[`${country[1].toLowerCase()}.svg`].default, weather: weather[0].description.slice(0, 1).toUpperCase() + weather[0].description.slice(1).toLowerCase(), weatherIcon: `http://openweathermap.org/img/w/${weather[0].icon}.png`, temperature: main.temp, windSpeed: wind.speed, state: state[1] !== 'name' ? state[1] : '' }, ...choosenCities]))
      }
    } catch (e) {
      console.log(e)
    }
  }

  // function showResults() {
  //   if (results.length) {

  //   }
  // }
  function noAction() {
    if (typeof source !== 'string') { source.cancel(); }
    setLoading(false);
    setButtonState(true);
  }

  function disableButton(origin: string) {
    if (origin === 'city') {
      if (country[0] === 'app') {
        setCountry(['app', 'default'])
        setButtonState(true)
      } else {
        return country[1] === 'default' ? setButtonState(true) : null
      }
    } else {
      return !city ? setButtonState(true) : null
    }
  }

  return (
    <>
      <div className={s.container}>
        <div className={s.searchContainer}>

          <div className={s.selectContainer}>
            <select className={`form-control`} id="countrySelector" value={country[1]} onChange={e => { setCountry(['user', e.target.value]); e.target.value === 'default' && !city ? noAction() : searchCity(city, ['user', e.target.value]) }} name="country">
              <option key='default' value='default'>Select a country</option>
              {countries.length ?
                countries.map(e => <option key={e.code} value={e.code}>{e.name}</option>)
                : null}
            </select>
            <img src={closeCircleOutline} className={s.iconDumb} onClick={() => { setCountry(['app', 'default', 'name']); disableButton('country') }} />
          </div>

          <div className={`${s.test} ${s.searchInput}`}>
            <Form.Control value={city} className={` ${s.inputPassword}`} placeholder="Enter a city" onChange={e => { setCity(e.target.value); !e.target.value && country[1] === 'default' ? noAction() : searchCity(e.target.value, country); }} />
            <img src={closeCircleOutline} className={s.iconDumb} onClick={() => { setCity(''); disableButton('city') }} />
          </div>




          {
            loading ?
              <div className={`btn btn-primary disabled ${s.searchButton}`}>
                <img src={loadingHorizontal} className={s.loadingHorizontal} alt='Loading'></img>
              </div>
              :
              <button className={`btn btn-primary ${s.searchButton}`} onClick={() => buttonContent === 'Add' ? add() : results.length ? dispatch(modifyModalState(true)) : null} disabled={buttonState}>{buttonContent}</button>
          }
        </div>
      </div>

      <Modal
        show={modalState}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => dispatch(modifyModalState(false))}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Select the citie you want to add
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={s.modalBody}>
          {
            results.length ?
              results.map((e, index) =>
                <Result key={index} searchResult={e} margin={index === results.length - 1 ? 0 : 1} />
              )
              :
              null
          }
        </Modal.Body>
      </Modal>
    </>
  )
};