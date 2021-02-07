import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import TokenData from '../interfaces/tokenData.interface';
import CreateUserDto from '../user/user.dto';
import User from '../user/user.entity';
import {Secret} from "jsonwebtoken";
import LogInDto from "./login.dto";
import EmailOrPasswordNotCorrectException from "../exceptions/EmailOrPasswordNotCorrectException";

class AuthenticationService {
    private userRepository = getRepository(User);

    public async register(userData: CreateUserDto) {
        if (
            await this.userRepository.findOne({ email: userData.email })
        ) {
            throw new UserWithThatEmailAlreadyExistsException(userData.email);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = this.userRepository.create({
            ...userData,
            password: hashedPassword,
        });
        await this.userRepository.save(user);
        (user.password as string | undefined) = undefined;
        const tokenData = this.createToken(user);
        const cookie = this.createCookie(tokenData);
        return {
            cookie,
            user,
        };
    }
    public createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
    public createToken(user: User): TokenData {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken: DataStoredInToken = {
            id: user.id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret as Secret, { expiresIn }),
        };
    }

    public async login(userData: LogInDto){
        console.log('userData: ', userData)
        // @ts-ignore
        const user: User = await this.userRepository.findOne({
            email: userData.email
        });

        if(user){
            const hashedPassword = await bcrypt.compare(userData.password, user.password);

            if(hashedPassword){
                const token = this.createToken(user)

                return {
                    token,
                    user,
                };
            } else {
                throw new EmailOrPasswordNotCorrectException()
            }

        } else {
            throw new EmailOrPasswordNotCorrectException()
        }
    }
}

export default AuthenticationService;