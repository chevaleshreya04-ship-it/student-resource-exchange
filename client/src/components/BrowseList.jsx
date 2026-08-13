import React from 'react'
import BrowseItem from './BrowseItem'
import './BrowseList.css'

const BrowseList = ({resources, onDelete}) => {
  return (
    <div>
        <ul>
            {
                resources.map((item) => {
                    return <li key={item._id}> <BrowseItem item={item} onDelete={onDelete} /> </li>
                })
            }
        </ul>
    </div>
  )
}

export default BrowseList