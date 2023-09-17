import prisma from "../../../prisma/prisma";
 
export default async function getPhoto(req, res) {
 
  const image = await prisma.images.findUnique({where:{id:req.query.id}});

  res.json(image)
}
