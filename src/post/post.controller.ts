import Post from "./post.entity";
import Controller from "../interfaces/controller.interface";
import {getRepository} from "typeorm";
import CreatePostDto from "./post.dto";
import express = require("express");
import PostNotFoundException from "../exceptions/PostNotFoundException";

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

    private deletePost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const deleteResponse = await this.postRepository.delete(id);
        if (deleteResponse.raw[1]) {
            response.sendStatus(200);
        } else {
            next(new PostNotFoundException(id));
        }
    }

    private modifyPost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const postData: Post = request.body;
        await this.postRepository.update(id, postData);
        const updatedPost = await this.postRepository.findOne(id);
        if (updatedPost) {
            response.send(updatedPost);
        } else {
            next(new PostNotFoundException(id));
        }
    }
}