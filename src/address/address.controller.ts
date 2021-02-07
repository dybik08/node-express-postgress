import * as express from 'express';
import { getRepository } from 'typeorm';
import Controller from '../interfaces/controller.interface';
import Address from './address.entity';
import CreateAddressDto from "./address.dto";
import validationMiddleware from "../middleware/validation.middleware";

class AddressController implements Controller {
    public path = '/addresses';
    public router = express.Router();
    private addressRepository = getRepository(Address);

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllAddresses);
        this.router.post(this.path, validationMiddleware(CreateAddressDto),this.createAddress);
    }

    private getAllAddresses = async (request: express.Request, response: express.Response) => {
        const addresses = await this.addressRepository.find();
        response.send(addresses);
    }

    private createAddress = async (request: express.Request, response: express.Response) => {
        const addressData: CreateAddressDto = request.body;
        const newAddress = this.addressRepository.create(addressData);
        await this.addressRepository.save(newAddress);
        response.send(newAddress);
        const addresses = await this.addressRepository.find();
        response.send(addresses);
    }
}

export default AddressController;