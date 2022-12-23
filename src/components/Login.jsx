import {GoogleLogin, GoogleOAuthProvider} from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import jwt_decode from 'jwt-decode'
import { client } from '../client'


export default function Login() {

    const navigate = useNavigate()

    const responseGoogle = async (response) => {
        const { credential } = response
        const userData = jwt_decode(credential)

        localStorage.setItem('user', JSON.stringify(userData))

        const { name: userName, sub: userId, picture: image } = userData
        const doc = {
            _id: userId,
            _type: 'user',
            userName,
            image
        }

        try{
            await client.createIfNotExists(doc)

            navigate('/', { replace: true })
        } catch(err){
            console.log('error', err)
        }
    }

    return (
        <div className='flex justify-start items-center flex-col h-screen'>
            <div className='relative w-full h-full'>
                <video 
                    src={shareVideo}
                    type="video/mp4"
                    loop
                    controls={false}
                    muted
                    autoPlay
                    className='w-full h-full object-cover'
                />
                <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
                    <div className='p-5'>
                        <img 
                            src={logo}
                            width='130px'
                            alt='logo'
                        />
                    </div>
                    <div className='shadow-2xl'>
                        
                            <GoogleLogin 
                                onSuccess={responseGoogle}
                                onError={responseGoogle}
                                cookiePolicy='single_host_origin'
                            />
                    </div>
                </div>
            </div>
        </div>
    )
}

