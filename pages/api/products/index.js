import dbConnect from "../../../util/mongo";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  const { method, cookies } = req;

  const token = cookies.token

  dbConnect();

  if (method === "GET") {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (err) {
      console.log('TESTE 15 ')
      console.error('Err: ', err);
      

      res.status(500).json(err);
      console.log('TESTE 16 ')
      console.error('Err: ', err);
      
    }
  }

  if (method === "POST") {
    if(!token || token !== process.env.token){
      return res.status(401).json("Not authenticated!")
    }
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      console.log('TESTE 17 ')
      res.status(500).json(err);
      console.error('Erro mongo.js: ', err);
      console.log('TESTE 18 ')
    }
  }
}
