import React, { useState } from 'react';
import s from './Result.module.css'
import { City, ResultProps } from '../../extras/types'

export default function Result({ searchResult, margin}: ResultProps) {
  // acá va tu código


  return (
    <div className={`${s.container} ${margin ? '' : 'mb-0'}`}>
      <span className='bold'>{searchResult.name}</span>
      <div className='mb-2'>
      {
        searchResult.state ?
        <><span>{`${searchResult.state}, `}</span><span>{searchResult.country.name}</span></>
        : 
        <span>{searchResult.country.name}</span>
      }
      </div>
      <button className='btn btn-primary w-100'>Add</button>
    </div>

  )
};