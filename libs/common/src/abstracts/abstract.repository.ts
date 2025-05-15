import { FilterQuery, Model, SaveOptions, Types, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.document";
import { NotFoundException } from "@nestjs/common";

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

    async findOneOrThrow(filterQuery: FilterQuery<T>): Promise<T> {
        const document = await this.findOne(filterQuery);
        if (!document) {
            throw new NotFoundException("Document not found.");
        }
        return document;
    }

    async find(filterQuery: FilterQuery<T>): Promise<T[]> {
        return this.model.find(filterQuery).exec();
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
