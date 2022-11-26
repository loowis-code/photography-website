import Image from 'next/image'

export default function PostBody({title, imgurl}) {
    return (
        <div>                        
            <div>
                <h1>{title}</h1>                
                <Image 
                src={imgurl}
                alt={title}
                width="600"
                height="600"
                layout='responsive'
                className="border border-dark rounded"
                priority='true'
                />               
            </div>
        </div>
    )
}