import mongoose, { Schema } from 'mongoose';

export class SchemaFactory {
  static createBaseSchema(additionalFields: Record<string, any> = {}): Schema {
    const baseFields = {
      _id: { type: String, required: true },
      createdAt: { type: Date, required: true, default: Date.now },
      updatedAt: { type: Date, required: true, default: Date.now }
    };

    return new mongoose.Schema({
      ...baseFields,
      ...additionalFields
    }, {
      timestamps: true,
      versionKey: false
    });
  }

  static createModel<T>(modelName: string, schema: Schema): mongoose.Model<T> {
    return mongoose.model<T>(modelName, schema);
  }
} 