import { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'

export default function Feed(){

    const [loading, setLoading] = useState(false)
    const {categoryId} = useParams()
    const [pins, setPins] = useState(null)

    useEffect(()=>{
        
        const populateFeed = async () => {
            
            setLoading(true)
            
            if(categoryId) {
                console.log('yoo');
                const query = searchQuery(categoryId)

                try{
                    const data = await client.fetch(query)

                    setPins(data)
                    setLoading(false)
                } catch(err){
                    console.log('error finding searched item', err)
                }
            } else {
                try{
                    const data = await client.fetch(feedQuery)

                    console.log('data', data)

                    setPins(data)
                    setLoading(false)
                } catch(err){
                    console.log('error fetching feed', err)
                }
            }
        }

        populateFeed()

    }, [ categoryId ])

    if( loading ) return <Spinner message="We are adding new ideas to your feed"/>

    if( !pins?.length ) return <h2>No pins available</h2>

    return (
        <div>
            {
                pins && <MasonryLayout pins={pins} />
            }
        </div>
    )
}