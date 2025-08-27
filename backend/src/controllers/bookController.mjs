import bookModel from "../models/bookModel.mjs";
const createBook = async (req, res) => {
    try {
            let data= req.body;
            const bool= await bookModel.create(data);
            return res.status(201).send({status:"ok", message:data});
    } catch (error) {
        if (error.message.includes('validation')) {
            return res.status(400).send({ status: "failed", message: error.message });
        } else if (error.message.includes('duplicate')) {
            return res.status(400).send({ status: "failed", message: error.message });
        } else {
            return res.status(500).send({ status: "failed", message: error.message });
        }
    }
}
const getBook= async (req,res)=>{
    try {
        const data= await bookModel.find().populate('author');
        return res.status(201).send({status:"ok", message:data});
    } catch (error) {
         if (error.message.includes('validation')) {
            return res.status(400).send({ status: "failed", message: error.message });
        } else if (error.message.includes('duplicate')) {
            return res.status(400).send({ status: "failed", message: error.message });
        } else {
            return res.status(500).send({ status: "failed", message: error.message });
        }
    }
}
export {createBook, getBook}