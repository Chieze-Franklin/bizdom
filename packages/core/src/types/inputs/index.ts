import { ID } from '../models';

export type Persisted<T> = Omit<T, 'id'> & { id: ID };

export type SaveInput<T> = Omit<T, 'id'>;

export type UpdateInput<T> = Partial<T> & { id: ID };
