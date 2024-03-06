export type SaveInput<T> = Omit<T, 'id'>;

export type UpdateInput<T> = Partial<T> & { id: string };
