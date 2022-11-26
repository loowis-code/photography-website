import Link from 'next/link';
import Image from 'next/image'

export default function PhotoPreview({ id, title, imgurl }) {
    return (
        <div className="col-6">
            
        <div >
            <Link href={`/photos/${id}`}>
                    <div className='card mb-3' >
                        <div>
                            (
                                <Image 
                                // src={imgurl}
                                alt={imgurl}
                                width="600"
                                height="600"
                                priority='false'
                                
                                />
                            )
                        </div>
                        
                            
                        <div className="card-body">
                            <h5 className="card-title">{title}</h5>
                        </div>

                    </div>
            </Link>
        </div>
        </div>
    )
}