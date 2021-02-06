import User from "./user.entity";
import Controller from "../interfaces/controller.interface";
import {getRepository} from "typeorm";
import CreateUserDto from "./user.dto";
import express = require("express");
import validationMiddleware from "../middleware/validation.middleware";

class UserController implements Controller {
    public path = '/user';
    public router = express.Router();
    private userRepository = getRepository(User);

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post(this.path, validationMiddleware(CreateUserDto), this.createUser)
        this.router.get(this.path, this.getAllUsers)
    }

    private createUser = async (request: express.Request, response: express.Response) => {
        const userData: CreateUserDto = request.body;
        const newUser = this.userRepository.create(userData);
        await this.userRepository.save(newUser);
        response.send(newUser);
    }

    private getAllUsers = async (request: express.Request, response: express.Response) => {
        const users = await this.userRepository.find();
        response.send(users);
    }
}

export default UserController