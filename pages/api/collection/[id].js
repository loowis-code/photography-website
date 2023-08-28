const faunadb = require('faunadb')

const secret = process.env.FAUNA_SECRET_KEY_2

const query = faunadb.query
const client = new faunadb.Client({ secret, domain: 'db.eu.fauna.com' })

module.exports = async (req, res) => {
  const { id } = req.query
  try {
    const dbs = await client.query(
      query.Map(
        query.Paginate(query.Match(query.Index('collections_by_id'), id)),
        query.Lambda('X', query.Get(query.Var('X'))),
      ),
    )
    let collectionInfo = {
      name: dbs.data[0].data.collection_name,
      description: dbs.data[0].data.collection_desc,
    }
    var photos = []
    photos.push(collectionInfo)
    let photo_ids = dbs.data[0].data.collection_photo_ids
    for (let i = 0; i < photo_ids.length; i++) {
      let dbs2 = await client.query(
        query.Map(
          query.Paginate(
            query.Match(query.Index('photos_by_url_id'), photo_ids[i].key),
          ),
          query.Lambda('X', query.Get(query.Var('X'))),
        ),
      )
      photos.push(dbs2.data[0])
    }
    res.status(200).json(photos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
