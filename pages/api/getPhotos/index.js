const faunadb = require('faunadb')

const secret = process.env.FAUNA_SECRET_KEY;

const query = faunadb.query;
const client = new faunadb.Client({secret, domain:"db.eu.fauna.com"})

module.exports = async (req, res) => {
    try {
        const dbs = await client.query(
            query.Reverse(
                query.Map(
                    query.Paginate (
                        query.Match (
                            query.Index('all_photos')
                        )
                    ),
                    (ref) => query.Get(ref)
                )
            )
        )
            
        res.status(200).json(dbs.data);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
}