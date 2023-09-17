import prisma from "../../../prisma/prisma";
 
export default async function getCollections(req, res) {
 
  const collections = await prisma.collections.findMany();

  res.json(collections)
}