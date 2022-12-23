import { AiOutlineLogout } from "react-icons/ai"
import { useParams, useNavigate } from 'react-router-dom'
import { GoogleLogout } from 'react-google-login'
import { useState } from "react"
import { useEffect } from "react"
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from "../utils/data"
import { client } from "../client"
import MasonryLayout from "./MasonryLayout"

const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,technology,gaming'

const activeBtnStyle = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none '
const notActiveBtnStyle = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none '

export default function UserProfile(){
    
    const [user, setUser] = useState()
    const [pins, setPins] = useState()
    const [text, setText] = useState('created')
    const [activeBtn, setActiveBtn] = useState('created')
    const navigate = useNavigate()
    const { userId } = useParams()
    
    useEffect(()=> {
        
        const fetchUserData = async ()=> {
            const query = userQuery(userId)

            const data = await client.fetch(query)

            setUser(data[0])
        }

        fetchUserData()

    }, [userId])

    useEffect(()=> {
        const populateCreatedPins = async ()=> {
            if(text === 'created') {
                const createdPinsQuery = userCreatedPinsQuery(userId)
    
                const response = await client.fetch(createdPinsQuery)
    
                setPins(response)
            } else {
                const savedPinsQuery = userSavedPinsQuery(userId)
    
                const response = await client.fetch(savedPinsQuery)
    
                setPins(response)

            }
        }

        populateCreatedPins()
    }, [text, userId])

    const logout = ()=> {
        localStorage.clear()

        navigate('/login')
    }


    return (
        <div className="relative pb-2 h-full justify-center items-center">
            <div className="flex flex-col pb-5">
                <div className="relative flex flex-col mb-7">
                    <div className=" flex flex-col justify-center items-center">
                        <img 
                            src={randomImage}
                            className="w-full h-370 2xl:h-510 shadow-lg object-cover"
                            alt="banner-pic"
                        />
                        <img 
                            className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
                            src={user?.image}
                            alt={`${user?.userName} profile`}
                        />
                        <h1 className="font-bold text-3xl text-center mt-3">
                            {user?.userName}
                        </h1>
                        <div className="absolute top-0 z-1 right-0 p-2">
                            { userId === user?._id && (
                                <GoogleLogout 
                                    render={(renderProps)=> (
                                        <button
                                            type="button"
                                            className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                                            onClick={renderProps.onClick}
                                            disabled={renderProps.disabled}
                                        >
                                            <AiOutlineLogout color="red" fontSize={21} />
                                        </button>
                                    )}
                                    onLogoutSuccess={logout}
                                    cookiePolicy="single_host_origin"
                                />
                            ) }
                        </div>
                    </div>
                    <div className="text-center mb-7">
                        <button
                            type="button"
                            onClick={e => {
                                setText(e.target.textContent)
                                setActiveBtn('created')
                            }}
                            className={`${activeBtn === 'created' ? activeBtnStyle : notActiveBtnStyle }`}
                        >
                            created
                        </button>
                        <button
                            type="button"
                            onClick={e => {
                                setText(e.target.textContent)
                                setActiveBtn('saved')
                            }}
                            className={`${activeBtn === 'saved' ? activeBtnStyle : notActiveBtnStyle }`}
                        >
                            saved
                        </button>
                    </div>
                    { pins?.length > 0 ? (
                        <div className="px-2">
                            <MasonryLayout pins={pins} />
                        </div>
                    ) : (
                        <div className="flex font-bold items-center w-full text-xl justify-center mt-2">
                            No pins found
                        </div>
                    ) }
                </div>
            </div>

        </div>
    )
}