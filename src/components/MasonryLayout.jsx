import Masonry from 'react-masonry-css'
import Pin from './Pin'


const breakPointobj = {
    default: 4,
    3000: 6,
    2000: 5,
    1200: 3,
    1000: 2,
    500: 1,
}

export default function MasonryLayout({pins}){
    return (
        <Masonry
            className='flex animate-slide-fwd'
            breakpointCols={breakPointobj}
        >
            {
                pins?.map((pin, index) => <Pin key={index} pin={pin} className='w-max' />)
            }
        </Masonry>
    )
} 