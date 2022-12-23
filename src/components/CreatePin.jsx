import { useState } from "react"
import { AiOutlineCloudUpload } from "react-icons/ai"
import { MdDelete } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import { client } from "../client"
import { categories } from "../utils/data"
import Spinner from "./Spinner"


export default function CreatePin({ user }){

    const [title, setTitle] = useState('')
    const [about, setAbout] = useState('')
    const [destination, setDestination] = useState('')
    const [loading, setLoading] = useState(!1)
    const [fields, setFields] = useState(!1)
    const [category, setCategory] = useState(null)
    const [imageAsset, setImageAsset] = useState(null)
    const [wrongImageType, setWrongImageType] = useState(false)

    const navigate = useNavigate()

    const uploadImage = async (e) => {
        const {type, name} = e.target.files[0]

        const allowedTypes = ['image/png', 'image/svg', 'image/jpeg', 'image/tiff', 'image/gif']

        if( allowedTypes.includes(type) ){
            setWrongImageType(!1)
            setLoading(!0)

            try {
                const document = await client.assets.upload('image', e.target.files[0], { contentType: type, filename: name })
                setImageAsset(document)
                setLoading(false)
            } catch (error) {
                console.log('Image upload error', error)
            }
        } else {
            setWrongImageType(!1)
        }
    }

    const savePin = async ()=> {
        if( title && about && destination && imageAsset?._id && category ) {
            const doc = {
                _type: 'pin',
                about,
                title,
                destination,
                image: {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageAsset?._id
                    }
                },
                userId: user?._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: user._id,
                },
                category
            }

            try {
                await client.create(doc)

                navigate('/')
            } catch (error) {
                console.log('error saving pin', error)
            }
        } else {
            setFields(true)
            setTimeout( () => { setFields(false) }, 4000 )
        }
    }


    return(
        <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5 ">
            {
                fields && (
                    <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in"> 
                        Please fill in all fields
                    </p>
                )
            }
            <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
                <div className="bg-secondaryColor p-3 flex flex-0.7 w-full cursor-pointer ">
                    <div className="flex justify-center items-center flex-col border-w border-dotted border-gray-300 p-3 w-full h-420">
                        {
                            loading && <Spinner />
                        }
                        {
                            wrongImageType && <p>Wrong Image type</p>
                        }
                        {
                            !imageAsset ? (
                                <label>
                                    <div className="flex flex-col item-center justify-center h-full ">
                                        <div className="flex flex-col justify-center items-center ">
                                            <p className="font-bold text-2xl ">
                                                <AiOutlineCloudUpload />
                                            </p>
                                            <p className="text-lg">
                                                Click to upload
                                            </p>
                                        </div>
                                        <p className="mt-32 text-gray-400">
                                            Use high-quality JPG, SVG, PNG, GIF less than 20 MB
                                        </p>
                                    </div>
                                    <input
                                        type='file'
                                        name='upload image'
                                        onChange={uploadImage}
                                        className='w-0 h-0'

                                    />
                                </label>
                            ) : (
                                <div className="relative w-full">
                                    <img 
                                        src={imageAsset?.url}
                                        className="h-full w-full "
                                        alt="uploaded-pic"
                                    />
                                    <button
                                        type="button"
                                        className="absolute bottom-3 right-3 p-3 rounded-full bg-white cursor-pointer text-xl outline-none hover:shadow-md transition-all duration-500 ease-in-out "
                                        onClick={()=> setImageAsset() }
                                    >
                                        <MdDelete />
                                    </button>
                                </div>
                            )
                        }
                    </div>
                </div>
                
                <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
                    <input 
                        type='text'
                        value={title}
                        onChange={ e => setTitle(e.target.value) }
                        placeholder="Add your title here"
                        className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2 "
                    />
                    {
                        user && (
                            <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
                                <img 
                                    src={user.image}
                                    className="w-10 h-10 rounded-full"
                                    alt="user-profile"
                                />
                                <p className="font-bold">{user.userName}</p>
                            </div>
                        )
                    }
                    <input 
                        type='text'
                        value={about}
                        onChange={ e => setAbout(e.target.value) }
                        placeholder="What is your pin about"
                        className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2 "
                    />
                    <input 
                        type='text'
                        value={destination}
                        onChange={ e => setDestination(e.target.value) }
                        placeholder="Add a destination link"
                        className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2 "
                    />
                    <div className="flex flex-col">
                        <div>
                            <p className="mb-2 font-semibold text-lg sm:text-xl">
                                Choose Pin Category
                            </p>
                            <select
                                onChange={ e => setCategory(e.target.value) }
                                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
                            >
                                <option value="other" className="bg-white">Select Category</option>

                                {
                                    categories.map(category => {
                                        return <option className="text-base border-0 outlie-none capitalize text-black bg-white" value={category.name} >
                                            {category.name}
                                        </option>
                                    })
                                }

                            </select>
                        </div>
                        <div className="flex justify-end items-end mt-5">
                            <button
                                type="button"
                                onClick={savePin}
                                className="bg-red-500 text-white w-28 outline-none font-bold p-2 rounded-full"
                            >
                                Save Pin
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}