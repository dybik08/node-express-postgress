import 'dotenv/config';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import App from './app';
import config from './ormconfig';
import PostController from './post/post.controller';
import validateEnv from './utils/validateEnv';
import AddressController from "./address/address.controller";
import UserController from "./user/user.controller";
import AuthenticationController from "./authentication/authentication.controller";
import CategoryController from "./category/category.controller";

validateEnv();

(async () => {
    try {
        const connection = await createConnection(config);
        await connection.runMigrations();
    } catch (error) {
        console.log('Error while connecting to the database', error);
        return error;
    }
    const app = new App(
        [
            new PostController(),
            new AddressController(),
            new UserController(),
            new AuthenticationController(),
            new CategoryController(),
        ],
    );
    app.listen();
})();