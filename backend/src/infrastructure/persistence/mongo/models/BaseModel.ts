import mongoose, { Document, Model, FilterQuery } from 'mongoose';

export interface IBaseDocument extends Document {
  _id: mongoose.Types.ObjectId;
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

  async aggregatePaginated(
    options: {
      match?: Record<string, any>;
      lookups?: {
        from: string;
        localField: string;
        foreignField: string;
        as: string;
        unwind?: boolean;
        preserveNullAndEmptyArrays?: boolean;
      }[];
      sort?: Record<string, 1 | -1>;
      offset?: number;
      limit?: number;
    }
  ): Promise<{ docs: T[]; total: number }> {
    const {
      match = {},
      lookups = [],
      sort = {},
      offset = 0,
      limit = 10
    } = options;
  
    const pipeline: any[] = [];
  
    // Agregar $lookup y $unwind
    for (const lookup of lookups) {
      pipeline.push({
        $lookup: {
          from: lookup.from,
          localField: lookup.localField,
          foreignField: lookup.foreignField,
          as: lookup.as
        }
      });
  
      if (lookup.unwind) {
        pipeline.push({
          $unwind: {
            path: `$${lookup.as}`,
            preserveNullAndEmptyArrays: lookup.preserveNullAndEmptyArrays ?? false
          }
        });
      }
    }
  
    // Agregar $match si existe
    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }
  
    // Agregar $facet con paginación y conteo
    pipeline.push({
      $facet: {
        docs: [
          ...(Object.keys(sort).length > 0 ? [{ $sort: sort }] : []),
          { $skip: offset },
          { $limit: limit }
        ],
        totalCount: [{ $count: 'total' }]
      }
    });
  
    const [result] = await this.model.aggregate(pipeline).exec();
  
    return {
      docs: result?.docs || [],
      total: result?.totalCount?.[0]?.total || 0
    };
  }
} 