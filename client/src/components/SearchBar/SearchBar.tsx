import React, { useState, useEffect } from 'react';
import s from './SearchBar.module.css';
import { Form, Modal } from 'react-bootstrap';
import axios, { CancelToken }  from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { modifyChoosenCities, modifyModalState } from '../../actions';
import { City, Flags, AvailableCity, Country, SearchResult } from '../../extras/types';
import Result from '../Result/Result'
import loadingHorizontal from '../../img/loadingHorizontalGif.gif';


export default function SearchBar() {

  const [source, setSource] = useState<{token: CancelToken, cancel: (() => void)} | string>('')
  const countries = useSelector((state: { countries: Country[] }) => state.countries)
  // const [countries, setCountries] = useState<Country[]>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [buttonState, setButtonState] = useState(true)
  const [buttonContent, setButtonContent] = useState('Search')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState(['app', 'default'])
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch();

  const modalState = useSelector((state: { modalState: boolean }) => state.modalState)
  const choosenCities = useSelector((state: { choosenCities: City[] }) => state.choosenCities)



  useEffect(() => {
    //if (country !== 'default') setAvailableCities(countriesCities.filter(f => f.country === country)[0]['cities'])
  }, [country])

  


  async function searchCity(cityName: string, country: string[]) {
    let cities: { data: SearchResult[] } = { data: [{ name: '', state: '', country: { code: '', name: '' } }] };
    // if (typeof cancel !== 'string' && cancel !== undefined) { 
    // //   console.log('olor', cancel)
    // //   console.log('sabor', typeof cancel )
    //   cancel()
    // }
    if (typeof source !== 'string') { source.cancel(); setLoading(false);}
    const CancelToken = axios.CancelToken;
    const newSource = CancelToken.source();
    console.log('NEW YORK', newSource.cancel) // -----------------------------------ANOTAR
    setSource(newSource)
    setLoading(true)
    if (country[1] !== 'default' && country[0] === 'user') {
      cities = await axios.get(`http://localhost:3001/cities?name=${cityName}&country=${country[1]}`, { cancelToken: newSource.token})
    } else {
      cities = await axios.get(`http://localhost:3001/cities?name=${cityName}`, { cancelToken: newSource.token})
    }
    setLoading(false);
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
  function noAction() {
    if (typeof source !== 'string') { source.cancel(); }  
    setLoading(false);
    setButtonState(true);
  }

  return (
    <>
      <div className={s.container}>
        <div className={s.searchContainer}>
          <select className={`form-control mb-3`} id="countrySelector" value={country[1]} onChange={e => { setCountry(['user', e.target.value]); e.target.value === 'default' && !city ? noAction() : searchCity(city, ['user', e.target.value]) }} name="country">
            <option key='default' value='default'>Select a country</option>
            {countries.length ?
              countries.map(e => <option key={e.code} value={e.code}>{e.name}</option>)
              : null}
          </select>
          <Form.Control className={s.searchInput} placeholder="Enter a city" onChange={e => { setCity(e.target.value); !e.target.value && country[1] === 'default' ? noAction() : searchCity(e.target.value, country); }} />
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
        <Modal.Body>
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