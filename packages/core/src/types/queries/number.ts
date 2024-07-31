export type NumberFields<T> = {
  [key in keyof T]?: T[key] extends number ? NumberOps<T> : never;
};

export type NumberOps<T> = ArrayNumberOp<T> | GreaterThanNumberOp<T> | LessThanNumberOp<T>;

export type ArrayNumberOp<T> = { $in: number[] };
export type GreaterThanNumberOp<T> = { $gt: number };
export type LessThanNumberOp<T> = { $lt: number };
// $eq, $ne, $gt, $gte, $lt, $lte
// $in, $nin
// $exists
// $type
// $mod
// $regex
// $text
// $where
// $geoIntersects
// $geoWithin
// $near
// $nearSphere
// $all
// $elemMatch
// $size
// $bitsAllClear
// $bitsAllSet
// $bitsAnyClear
// $bitsAnySet
// $comment
