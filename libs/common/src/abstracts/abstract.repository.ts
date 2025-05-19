import { FilterQuery, Model, SaveOptions, Types, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.document";
import { HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { PaginationQuery } from "@app/sdk";

export abstract class AbstractRepository<T extends AbstractDocument> {
    constructor(protected readonly model: Model<T>) {}

    async create(document: Omit<T, "_id">, options?: SaveOptions): Promise<T> {
        const createdDocument = new this.model({
            ...document,
            _id: new Types.ObjectId(),
        });
        return await createdDocument.save(options);
    }

    async findOne(filterQuery: FilterQuery<T>): Promise<T | null> {
        const document = await this.model.findOne(filterQuery).exec();
        return document ?? null;
    }

    async findRecentOne(filterQuery: FilterQuery<T>): Promise<T | null> {
        const document = await this.model
            .findOne(filterQuery)
            .sort({ _id: -1 })
            .exec();
        return document ?? null;
    }

    async findOneOrThrow(filterQuery: FilterQuery<T>): Promise<T> {
        const document = await this.findOne(filterQuery);
        if (!document) {
            throw new RpcException({
                statusCode: HttpStatus.NOT_FOUND,
                message: "도큐먼트가 존재하지 않습니다.",
            });
        }
        return document;
    }

    async count(filterQuery: FilterQuery<T>): Promise<number> {
        return this.model.countDocuments(filterQuery).exec();
    }

    async findAll(filterQuery: FilterQuery<T>): Promise<T[]> {
        return this.model.find(filterQuery).exec();
    }

    async findAllPaginated(
        filterQuery: FilterQuery<T>,
        options: PaginationQuery
    ): Promise<T[]> {
        const { skip, take } = options;

        let query = this.model.find(filterQuery);
        if (skip >= 0) {
            query = query.skip(skip);
        }
        if (take >= 1) {
            query = query.limit(take);
        }
        return query.exec();
    }

    async updateOne(
        filterQuery: FilterQuery<T>,
        update: UpdateQuery<T>,
        options?: SaveOptions
    ): Promise<T> {
        return this.model.findOneAndUpdate(filterQuery, update, options);
    }

    async deleteOne(filterQuery: FilterQuery<T>): Promise<void> {
        await this.model.deleteOne(filterQuery);
    }

    async deleteMany(filterQuery: FilterQuery<T>): Promise<void> {
        await this.model.deleteMany(filterQuery);
    }
}
