import dbConnect from "../../../util/mongo";
import Order from "../../../models/Order";

const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  if (method === "GET") {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (err) {
      console.log('TESTE 5 ')
      res.status(500).json(err);
      console.log('TESTE 6 ')
    }
  }
  if (method === "POST") {
    try {
      const order = await Order.create(req.body);
      res.status(201).json(order);
    } catch (err) {
      console.log('TESTE 7 ')
      res.status(500).json(err);
      console.log('TESTE 8 ')
    }
  }
};

export default handler;
