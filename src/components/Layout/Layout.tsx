import { ButtonLink, SearchField, Wordmark } from 'loowis-component-library'
import { Link, useNavigate } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import styles from './Layout.module.css'

type RouterLinkProps = ComponentProps<'a'> & { href: string }

function RouterLink({ href, ...props }: RouterLinkProps) {
    return <Link to={href} {...props} />
}

export default function Layout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate()

    function handleSearchEvent(term: string) {
        if (!term) return
        navigate({ to: '/search/$query', params: { query: term } })
    }

    return (
        <>
            <header className={styles.header}>
                <SearchField
                    className={styles.search}
                    inputProps={{ placeholder: 'Search photographs' }}
                    onSearch={handleSearchEvent}
                    submitLabel="Search"
                />
                <Wordmark linkComponent={RouterLink} />
                <nav className={styles.navigation} aria-label="Primary">
                    <ButtonLink href="/all-images" linkComponent={RouterLink}>
                        ALL IMAGES
                    </ButtonLink>
                    <ButtonLink href="/collections" linkComponent={RouterLink}>
                        COLLECTIONS
                    </ButtonLink>
                    <ButtonLink href="/image-map" linkComponent={RouterLink}>
                        IMAGE MAP
                    </ButtonLink>
                </nav>
            </header>
            <main>{children}</main>
        </>
    )
}
