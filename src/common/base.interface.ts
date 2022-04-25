import { ModelFindOneAndUpdateOptions, ModelPopulateOptions } from 'mongoose';

export interface ModelFindInputInterface {
  filter: any;
  projection?: any;
  options?: {
    sort?: any;
    limit?: number;
    skip?: number;
    populates?: ModelPopulateOptions[];
    [key: string]: any;
  };
}

export interface ModelFindOneInputInterface {
  filter: any;
  projection?: any;
  populates?: ModelPopulateOptions[];
  options?: {
    [key: string]: any;
  };
}

export interface ModelAggregateInputInterface {
  pipeline: any[];
}

export interface ModelCountInputInterface {
  filter: any;
}

export interface ModelCreateInputInterface<T> {
  docs: Partial<T> | Partial<T>[];
  populates?: ModelPopulateOptions[];
}

export interface UpdateInputInterface<T> {
  conditions: any;
  update: Partial<T> & {
    $inc?: { [key: string]: number };
    $unset?: { [key: string]: number };
  };
  options?: ModelFindOneAndUpdateOptions;
  populates?: ModelPopulateOptions[];
}

export interface DeleteInputInterface {
  conditions: any;
  options?: ModelFindOneAndUpdateOptions;
  populates?: ModelPopulateOptions[];
}
