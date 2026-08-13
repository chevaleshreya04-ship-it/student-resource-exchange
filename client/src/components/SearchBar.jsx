import React from 'react'
import './SearchBar.css'

const SearchBar = ({setSearchTerm}) => {

    const handleChange = (e) => {
        setSearchTerm(e.target.value)
    }

  return (
    <form onSubmit={(e) => e.preventDefault()} className='search-form'>
        <label className='search-label' htmlFor="resource-title">Search resources:</label>
        <input  className='search-input' onChange={handleChange} id='resource-title' name='resource-title' type="text" />
        <button className='search-btn'>Go</button>
    </form>
  )
}

export default SearchBar