import mongoose, { Document, Model, FilterQuery } from 'mongoose';

export interface IBaseDocument extends Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class BaseModel<T extends IBaseDocument> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async create(data: Partial<T>): Promise<T> {
    const newDocument = new this.model(data);
    return newDocument.save();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
  
  async findByIds(ids: string[]): Promise<T[]> {
    return this.model.find({ _id: { $in: ids } } as FilterQuery<T>).exec();
  }
  
  async findByFilter(filter: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filter).exec();
  }
  
  async findPaginatedWithFilters(
    filter: FilterQuery<T>,
    offset: number = 0,
    limit: number = 10
  ): Promise<{ docs: T[]; total: number }> {
    const total = await this.model.countDocuments(filter);
    const docs = await this.model.find(filter).skip(offset).limit(limit).exec();
    return { docs, total };
  }
} 