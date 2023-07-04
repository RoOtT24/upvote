import commentModel from "../../../../DB/model/Comment.model.js";
import postModel from "../../../../DB/model/Post.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import { compare, hash } from "../../../Services/hashAndCompare.js";

export const createPost = asyncHandler(async (req, res, next) => {
  const { title, caption } = req.body;
  const id = req.id;
  console.log(id);

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: "Post" }
  );

  const post = await postModel.create({
    title,
    caption,
    image: { secure_url, public_id },
    userId: id,
  });

  return res.status(201).json({
    message: "success",
    post,
  });
});

export const likePost = asyncHandler(async (req, res, next) => {
  const userId = req.id;
  const { id } = req.params;
  const post = await postModel.findByIdAndUpdate(
    id,
    {
      $addToSet: { like: userId },
      $pull: { unLike: userId },
    },
    { new: true }
  );

  post.totalVote = post.like.length - post.unLike.length;
  post.save();

  return res.status(200).json({
    message: "success",
    post,
  });
});

export const unLikePost = asyncHandler(async (req, res, next) => {
  const userId = req.id;
  const { id } = req.params;
  const post = await postModel.findByIdAndUpdate(
    id,
    {
      $addToSet: { unLike: userId },
      $pull: { like: userId },
    },
    { new: true }
  );

  post.totalVote = post.like.length - post.unLike.length;
  post.save();

  return res.status(200).json({
    message: "success",
    post,
  });
});

export const getPosts = asyncHandler(async (req, res, next) => {
  //   const posts = await postModel.find({}).populate([
  //     {
  //       path: "userId",
  //       select: "userName",
  //     },
  //     {
  //       path: "like",
  //       select: "userName userId",
  //     },
  //     {
  //       path: "unLike",
  //       select: "userName userId",
  //     },
  //   ]);
  //   const postsList = [];
  //   for(const post of posts){
  //     const comments = await commentModel.find({postId: post._id})
  //     postsList.push({post, comments})
  //   }

  //   return res.status(200).json({ message: "success", posts:postsList });
  const cursor = postModel
    .find({})
    .populate([
      {
        path: "userId",
        select: "userName",
      },
      {
        path: "like",
        select: "userName userId",
      },
      {
        path: "unLike",
        select: "userName userId",
      },
    ])
    .cursor();


    const postsList = [];
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    const comments = await commentModel.find({ postId: doc._id });
    postsList.push({ post:doc, comments });
  }
  return res.json({ message: "success", posts: postsList });
});
