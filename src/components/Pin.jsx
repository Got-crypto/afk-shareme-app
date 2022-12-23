import { urlFor, client } from "../client";
import {v4 as uuidv4} from 'uuid'
import { MdDownloadForOffline } from 'react-icons/md'
import {AiTwotoneDelete} from 'react-icons/ai'
import {BsFillArrowUpRightCircleFill} from 'react-icons/bs'
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { fetchUser } from "../utils/fetchUser";

export default function Pin({ pin: { save, postedBy, image, _id, destination } }){
    
    const [postHovered, setPostHovered] = useState(false)
    const navigate = useNavigate()

    console.log('save', save)

    console.log('destination', destination)

    const user = fetchUser()

    const alreadySaved = !!(save?.filter(item => item?.postedBy?._id === user.sub))?.length

    console.log('alreadySaved', alreadySaved)

    const savePin = async id => {
        if( !alreadySaved ) {
            try{
                await client
                    .patch(id)
                    .setIfMissing( { save: [] } )
                    .insert('after', 'save[-1]', [{
                        _key: uuidv4(),
                        userId: user.sub,
                        postedBy: {
                            _type: 'postedBy',
                            _ref: user.sub
                        }
                    }])
                    .commit()   

                window.location.reload()

                console.log("post saved successfully");
            } catch( err ){
                console.log('error saving post', err)
            }
        } else{
            console.log("image already saved");
        }
    }

    const deletePin = async id => {
        try{
            await client.delete(id)
            window.location.reload()
        } catch(err) {
            console.log('error deleting pin', err)
        }
    }

    return(
        <div className="m-2">
            <div
                className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
                onMouseEnter={()=>{
                    setPostHovered(true)
                }}
                onMouseLeave={()=>{
                    setPostHovered(false)
                }}
                onClick={()=> navigate(`/pin-detail/${_id}`)}
            >
                <img 
                    className="rounded-lg w-full"
                    alt='user post'
                    src={urlFor(image).width(250).url()}
                />
                {postHovered && (
                    <div className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
                        style={{
                            height: '100%'
                        }}
                    >
                        <div className="flex items-center justify-between"> 
                            <div className="flex gap-2">
                                <a
                                    href={`${image?.asset?.url}?dl=`}
                                    download
                                    onClick={(e)=> e.stopPropagation() }
                                    className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                                >
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                            {
                                alreadySaved ? (
                                    <button
                                     className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                                    >
                                        {save?.length} saved
                                    </button>
                                ) : (
                                    <button
                                        className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                                        onClick={(e)=>{
                                            e.stopPropagation()
                                            savePin(_id)
                                        }}
                                    >
                                        Save
                                    </button>
                                )
                            }
                        </div>
                        <div className="flex justify-between items-center w-full gap-2">
                            {
                                destination && (
                                    <a
                                        href={destination}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                                    >
                                        <BsFillArrowUpRightCircleFill />
                                        {destination.length > 20 ? destination.slice(8, 20) : destination(8)}
                                    </a>
                                )
                            }
                            {
                                postedBy?._id === user.sub && (
                                    <button
                                        className="bg-white p-2 opacity-70 hover:opacity-100 font-bold text-base rounded-3xl text-dark hover:shadow-md outline-none"
                                        onClick={(e)=>{
                                            e.stopPropagation()
                                            deletePin(_id)
                                        }}
                                    >
                                        <AiTwotoneDelete />                          
                                    </button>
                                )
                            }
                        </div>
                    </div>
                )}
            </div>
            <Link to={`user-profile/${postedBy?._id}`} className="flex gap-2 mt-2 items-center" >
                <img 
                    className="w-8 h-8 rounded-full object-cover"
                    src={postedBy?.image}
                    alt="user-profile"
                />
                <p className="font-semibold capitalize text-sm font-mono"> {postedBy?.userName} </p>
            </Link>
        </div>
    )
}