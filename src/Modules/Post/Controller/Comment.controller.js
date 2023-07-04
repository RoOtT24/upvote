import commentModel from "../../../../DB/model/Comment.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";

export const createComment = asyncHandler(async(req,res,next)=>{

    req.body.postId = req.params.id;
    req.body.userId = req.id;


    if(req.file){
        const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,{folder:'comment'});
        req.body.image = {secure_url, public_id};
    }

    const comment = await commentModel.create(req.body);

    return res.status(201).json({message:"success",comment})
})