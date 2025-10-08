module.exports = {
    images: {
        contentDispositionType: 'inline',
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'photography-website.s3.eu-west-2.amazonaws.com',
                port: '',
                pathname: '/**',
                search: '',
            },
            new URL('https://qcbkrcgtrfkj20sb.public.blob.vercel-storage.com/**'),
        ]
    },
}
