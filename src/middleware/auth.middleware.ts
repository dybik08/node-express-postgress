import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import User from '../user/user.entity';
import {Secret} from "jsonwebtoken";

async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
    const token = request.headers.authorization?.split(' ')[1];
    const userRepository = getRepository(User);
    if (token) {
        const secret = process.env.JWT_SECRET;
        try {
            const verificationResponse = jwt.verify(token, secret as Secret) as DataStoredInToken;
            const id = verificationResponse.id;
            const user = await userRepository.findOne(id);
            if (user) {
                request.user = user;
                next();
            } else {
                next(new WrongAuthenticationTokenException());
            }
        } catch (error) {
            next(new WrongAuthenticationTokenException());
        }
    } else {
        next(new AuthenticationTokenMissingException());
    }
}

export default authMiddleware;