import Layout from '../components/Layout'
import styles from './css-modules/login-test.module.css'
import Head from 'next/head'
import { useSession, signIn, signOut } from 'next-auth/react'

function LoginTest() {
    const { data: session } = useSession()
    if (session) {
        return (
            <Layout>
                <Head>
                    <title>Login Test | Lewis Inches - Photography</title>
                </Head>
                <section className={styles.container}>
                    <h1 className={styles.header}>Login Test</h1>
                    <p className={styles.text}>
                        Signed in as {session.user.email}
                    </p>
                    <button onClick={() => signOut()}>Sign out</button>
                </section>
            </Layout>
        )
    }
    return (
        <Layout>
            <Head>
                <title>Login Test | Lewis Inches - Photography</title>
            </Head>
            <section className={styles.container}>
                <h1 className={styles.header}>Login Test</h1>
                <p className={styles.text}>You are not signed in</p>
                <button className={styles.button} onClick={() => signIn()}>
                    Sign in
                </button>
            </section>
        </Layout>
    )
}

export default LoginTest
