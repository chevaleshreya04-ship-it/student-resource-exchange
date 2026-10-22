import type { Resource } from '../types';
import BrowseItem from './BrowseItem'
import './BrowseList.css'

interface BrowseListProps {
  resources: Resource[],
  onDelete?: (id: string) => void;
}

const BrowseList = ({resources, onDelete}: BrowseListProps) => {
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