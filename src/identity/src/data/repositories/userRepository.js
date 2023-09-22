"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_1 = require("../../user/entities/user");
const dataSource_1 = require("../dataSource");
class UserRepository {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = dataSource_1.dataSource.getRepository(user_1.User);
            return yield userRepository.save(user);
        });
    }
    updateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = dataSource_1.dataSource.getRepository(user_1.User);
            return yield userRepository.save(user);
        });
    }
    findUsers(page, pageSize, orderBy, order, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = dataSource_1.dataSource.getRepository(user_1.User);
            const skip = (page - 1) * pageSize;
            const take = pageSize;
            const queryBuilder = userRepository
                .createQueryBuilder('user')
                .orderBy(`user.${orderBy}`, order)
                .skip(skip)
                .take(take);
            // Apply filter criteria to the query
            if (searchTerm) {
                queryBuilder.andWhere('user.name LIKE :name', { name: `%${searchTerm}%` });
            }
            return yield queryBuilder.getManyAndCount();
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = dataSource_1.dataSource.getRepository(user_1.User);
            return yield userRepository.findOneBy({
                email: email
            });
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = dataSource_1.dataSource.getRepository(user_1.User);
            return yield userRepository.findOneBy({
                id: id
            });
        });
    }
    findUserByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = dataSource_1.dataSource.getRepository(user_1.User);
            return yield userRepository.findOneBy({
                name: name
            });
        });
    }
    removeUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = dataSource_1.dataSource.getRepository(user_1.User);
            return yield userRepository.remove(user);
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = dataSource_1.dataSource.getRepository(user_1.User);
            return yield userRepository.find();
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=userRepository.js.map