import { Header } from 'loowis-component-library'
import { useNavigate } from '@tanstack/react-router'

export default function Layout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate()

    function handleSearchEvent(term: string) {
        if (!term) return
        navigate({ to: '/search/$query', params: { query: term } })
    }

    return (
        <>
            <Header
                navTabs={['ALL IMAGES', 'COLLECTIONS', 'IMAGE MAP']}
                navLinks={['/all-images', '/collections', '/image-map']}
                handleSearch={handleSearchEvent}
            />
            {children}
        </>
    )
}
