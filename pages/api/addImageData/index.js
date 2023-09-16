import prisma from "../../../prisma/prisma";
 
export default async function addImageData(req, res) {
  const newImageData = await prisma.image.create({
    data: {
      url: 'filename.jpg',
      title: 'Train Station 2',
    },
  });
 
  const images = await prisma.image.findMany();

  res.json(images)
}