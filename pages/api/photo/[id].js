const faunadb = require('faunadb')

const secret = process.env.FAUNA_SECRET_KEY_2

const query = faunadb.query
const client = new faunadb.Client({ secret, domain: 'db.eu.fauna.com' })

module.exports = async (req, res) => {
    const { id } = req.query
    const idInt = parseInt(id)

    try {
        const dbs = await client.query(
            query.Map(
                query.Paginate(
                    query.Match(query.Index('photos_by_url_id'), idInt),
                ),
                query.Lambda('X', query.Get(query.Var('X'))),
            ),
        )
        res.status(200).json(dbs.data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
