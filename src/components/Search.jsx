import { useEffect } from "react"
import { useState } from "react"
import { client } from "../client"
import { feedQuery, searchQuery } from "../utils/data"
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'

export default function Search({searchTerm}) {
    
    const [pins, setPins] = useState()
    const [loading, setLoading] = useState(false)
    
    useEffect(()=> {
        const populateFeed = async ()=> {
            if( searchTerm ){
                
                setLoading(true)

                const query = searchQuery(searchTerm.toLowerCase())

                const response = await client.fetch(query)

                setPins(response)
                setLoading(false)
            } else {
                const response = await client.fetch(feedQuery)

                setPins(response)
                setLoading(false)
            }
        }

        populateFeed()
    }, [searchTerm])

    return (
        <div>
            {loading && <Spinner message="Searching for pins..." />}
            {pins?.length !== 0 && <MasonryLayout pins={pins} />}
            {pins?.length === 0 && searchTerm !== '' && !loading && (
                <div className="mt-10 text-center text-xl">
                    No pins found
                </div>
            )}
        </div>
    )
}