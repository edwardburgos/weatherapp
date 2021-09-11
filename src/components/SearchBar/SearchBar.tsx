import React from 'react';
import s from './SearchBar.module.css';
import { Form } from 'react-bootstrap';
import axios from 'axios';

export default function SearchBar() {

  async function search() {
    //await axios.get()
  }

  return (
    <div className={s.container}>
      <h1 className='mb-3 w-100 text-center'>Search a city</h1>
      <div className={s.searchContainer}>
        <Form.Control className={s.searchInput} placeholder="Enter a city" />
        <button className={`btn btn-primary ${s.searchButton}`} onClick={() => search()}>Search</button>
      </div>
    </div>
  )
};