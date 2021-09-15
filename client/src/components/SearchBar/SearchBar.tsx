import React, { useState, useEffect } from 'react';
import s from './SearchBar.module.css';
import { Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { modifyChoosenCities } from '../../actions';
import { City, Flags, AvailableCity, Country, SearchResult } from '../../extras/types';
import Result from '../Result/Result'


export default function SearchBar() {

  const [cancel, setCancel] = useState('')
  const countries = useSelector((state: { countries: Country[] }) => state.countries)
  // const [countries, setCountries] = useState<Country[]>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [buttonState, setButtonState] = useState(true)
  const [buttonContent, setButtonContent] = useState('Search')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState(['app', 'default'])
  const [results, setResults] = useState<SearchResult[]>([])

  const dispatch = useDispatch();

  const choosenCities = useSelector((state: { choosenCities: City[] }) => state.choosenCities)



  useEffect(() => {
    //if (country !== 'default') setAvailableCities(countriesCities.filter(f => f.country === country)[0]['cities'])
  }, [country])

  async function searchCity(cityName: string, country: string[]) {
    let cities: { data: SearchResult[] } = { data: [{ name: '', state: '', country: { code: '', name: '' } }] };
    const CancelToken = axios.CancelToken;
    if (cancel !== undefined) {
      cancel();
      console.log("cancelled");
    }
    if (country[1] !== 'default') {
      cities = await axios.get(`http://localhost:3001/cities?name=${cityName}&country=${country[1]}`, { cancelToken: new CancelToken(function executor(c) { setCancel(c)})})
    } else {
      cities = await axios.get(`http://localhost:3001/cities?name=${cityName}`, { cancelToken: new CancelToken(function executor(c) { setCancel(c)})})
    }
    if (cities.data.length === 1 && cities.data[0].name.toLowerCase() === cityName) { if (country[0] !== 'user') { setCountry(['app', cities.data[0].country.code]); } setButtonContent('Add'); setButtonState(false) }
    else {
      if (cities.data.length) {
        if (country[0] !== 'user') { setCountry(['app', 'default']) } setButtonContent('Search'); setResults(cities.data); setButtonState(false)
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

  function add() {
    //dispatch(modifyChoosenCities([...choosenCities, { name: 'paolo', country: 'paolo', flag: 'paolo', weather: 'paolo', weatherIcon: `paolo`, temperature: 15, windSpeed: 16 }]))

  }

  // function showResults() {
  //   if (results.length) {

  //   }
  // }

  return (
    <>
      <div className={s.container}>
        <div className={s.searchContainer}>
          <select className={`form-control mb-3`} id="countrySelector" value={country[1]} onChange={e => { setCountry(['user', e.target.value]); e.target.value === 'default' && !city ? setButtonState(true) : searchCity(city, ['user', e.target.value]) }} name="country">
            <option key='default' value='default'>Select a country</option>
            {countries.length ?
              countries.map(e => <option key={e.code} value={e.code}>{e.name}</option>)
              : null}
          </select>
          <Form.Control className={s.searchInput} placeholder="Enter a city" onChange={e => { setCity(e.target.value); !e.target.value && country[1] === 'default' ? setButtonState(true) : searchCity(e.target.value, country); }} />
          <button className={`btn btn-primary ${s.searchButton}`} onClick={() => buttonContent === 'Add' ? add() : results.length ? setShowModal(true) : null} disabled={buttonState}>{buttonContent}</button>
        </div>
      </div>

      <Modal
        show={showModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => setShowModal(false)}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Select the cities you want to add
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            results.length ?
              results.map((e, index) =>
                <Result searchResult={e} margin={index === results.length - 1 ? 0 : 1} />
              )
              :
              null
          }
        </Modal.Body>
      </Modal>
    </>
  )
};