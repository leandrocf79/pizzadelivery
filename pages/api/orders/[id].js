import dbConnect from "../../../util/mongo";
import Order from "../../../models/Order";

const handler = async (req, res) => {
  const {
    method,
    query: { id },
  } = req;

  await dbConnect();

  if (method === "GET") {
    try {
      const order = await Order.findById(id);
      res.status(200).json(order);
    } catch (err) {
      console.log('TESTE 1 ')
      res.status(500).json(err);
      console.log('TESTE 2 ')
    }
  }
  if (method === "PUT") {
    try {
      const order = await Order.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(order);
    } catch (err) {
      console.log('TESTE 3 ')
      res.status(500).json(err);
      console.log('TESTE 4 ')
    }
  }
  if (method === "DELETE") {
  }
};

export default handler;
