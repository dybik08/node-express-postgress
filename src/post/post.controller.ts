import Post from "./post.entity";
import Controller from "../interfaces/controller.interface";
import {getRepository} from "typeorm";
import CreatePostDto from "./post.dto";
import express = require("express");
import PostNotFoundException from "../exceptions/PostNotFoundException";
import validationMiddleware from "../middleware/validation.middleware";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";

class PostController implements Controller {
    public path = '/posts';
    public router = express.Router();
    private postRepository = getRepository(Post);

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);


        this.router
        // @ts-ignore
            .all(`${this.path}/*`, authMiddleware)
            .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
            .delete(`${this.path}/:id`, this.deletePost)
            // @ts-ignore
            .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost);
    }

    private createPost = async (request: RequestWithUser, response: express.Response) => {
        const postData: CreatePostDto = request.body;
        // @ts-ignore
        const newPost = this.postRepository.create({
            ...postData,
            author: request.user,
        });
        await this.postRepository.save(newPost);
        response.send(newPost);
    }

    private getAllPosts = async (request: express.Request, response: express.Response) => {
        const posts = await this.postRepository.find({ relations: ['categories'] });
        response.send(posts);
    }

    private getPostById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const post = await this.postRepository.findOne(id, { relations: ['categories'] });
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

export default PostController;