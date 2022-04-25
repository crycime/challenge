import * as _ from 'lodash';
import { Document, Model } from 'mongoose';
import {
  DeleteInputInterface,
  ModelAggregateInputInterface,
  ModelCountInputInterface,
  ModelCreateInputInterface,
  ModelFindInputInterface,
  ModelFindOneInputInterface,
  UpdateInputInterface,
} from './base.interface';
import { CatchError } from '../decorators/catchError.decorator';
import { MongoResponseErrorException } from '../exceptions/mongoResponseError.exception';
import { ConvertMongoObjectIds } from '../decorators/convertMongoObjectIds.decorator';
import { populateHelper } from '../utils/model.util';

@CatchError(MongoResponseErrorException)
@ConvertMongoObjectIds()
export abstract class ModelBaseService<T extends Document> {
  protected constructor(private readonly _model: Model<T>) {}

  find<K>({
    filter,
    projection,
    options,
  }: ModelFindInputInterface): Promise<T[]> {
    const docsQuery = this._model.find(
      filter,
      projection,
      _.omit(options, ['populates']),
    );
    return populateHelper<T>(docsQuery, _.get(options, 'populates')).lean();
  }

  findOne<K>({
    filter,
    projection,
    populates,
    options,
  }: ModelFindOneInputInterface): Promise<T> {
    const docsQuery = this._model.findOne(filter, projection, options);
    return populateHelper<T>(docsQuery, populates).lean();
  }

  aggregate<K>({ pipeline }: ModelAggregateInputInterface): Promise<K[]> {
    return this._model.aggregate(pipeline);
  }

  count({ filter }: ModelCountInputInterface): Promise<number> {
    return this._model.countDocuments(filter);
  }

  async create({ docs, populates }: ModelCreateInputInterface<T>): Promise<T> {
    const createdDoc = await this._model.create(docs);
    return populateHelper(createdDoc, populates).execPopulate();
  }

  async bulkCreate({ docs }: { docs: Partial<T>[] }): Promise<T[]> {
    return await this._model.create(docs);
  }

  async bulkWrite(docs: any): Promise<any> {
    return await this._model.bulkWrite(docs);
  }

  update({
    conditions,
    update,
    options,
    populates,
  }: UpdateInputInterface<T>): Promise<T> {
    const updatedDoc = this._model.findOneAndUpdate(
      conditions,
      {
        ...update,
        $inc: { ..._.get(update, '$inc', {}), __v: 1 },
      },
      {
        ...options,
        new: true,
      },
    );
    return populateHelper<T>(updatedDoc, populates).lean();
  }

  updateMany({
    conditions,
    update,
    options,
  }: UpdateInputInterface<T>): Promise<T> {
    return this._model.updateMany(
      conditions,
      {
        ...update,
        $inc: { ..._.get(update, '$inc', {}), __v: 1 },
      },
      {
        ...options,
        new: true,
      },
    );
  }

  delete({ conditions, options, populates }: DeleteInputInterface): Promise<T> {
    const deletedDoc = this._model.findOneAndDelete(conditions, options);
    return populateHelper<T>(deletedDoc, populates).lean();
  }
}
