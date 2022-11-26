import Link from 'next/link';

export default function Header () {
    return (
        <div>
            <div>
                <Link href="/">Lewis Inches | Photography</Link>
                
                <Link href="/all-photos" >View All photos</Link>
                
                <Link href="/about-contact">About Me</Link>
            </div>
        </div>
    );

}
