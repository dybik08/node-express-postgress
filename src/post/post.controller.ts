import Post from "./post.entity";
import Controller from "../interfaces/controller.interface";
import {getRepository} from "typeorm";
import CreatePostDto from "./post.dto";
import express = require("express");

class PostController implements Controller {
    public path = '/posts';
    public router = express.Router();
    private postRepository = getRepository(Post);

    constructor() {

    }

    private createPost = async (request: express.Request, response: express.Response) => {
        const postData: CreatePostDto = request.body;
        const newPost = this.postRepository.create(postData);
        await this.postRepository.save(newPost);
        response.send(newPost);
    }

    private getAllPosts = async (request: express.Request, response: express.Response) => {
        const posts = await this.postRepository.find();
        response.send(posts);
    }

    private getPostById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const post = await this.postRepository.findOne(id);
        if (post) {
            response.send(post);
        } else {
            next(new PostNotFoundException(id));
        }
    }
}