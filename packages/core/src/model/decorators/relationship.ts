// import { Model, ModelDefinition } from '../.';
// import { ID, isID, NullOrUndefined, QueryMeta, QueryParams } from '../..';
// import { getFieldHash, GlobalContext, Relationship } from '../../global/old';

// export function relationship<T extends ModelDefinition>(options: Relationship<T>) {
//   return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
//     const fieldHash = getFieldHash(target, propertyKey);
//     GlobalContext.addFieldRelationship(fieldHash, {
//       field: options.field,
//       many: options.many,
//       model: options.model,
//     });
//     GlobalContext.discoverField(fieldHash);

//     const setOne = async (value: ID | T | NullOrUndefined) => {
//       if (!value) {
//         descriptor.value = value;
//       } else if (isID(value)) {
//         descriptor.value = value;
//       } else {
//         descriptor.value = (value[options.field] as any).value || value[options.field];
//       }
//     };
//     const setMany = async (value: ID[] | T[]) => {
//       descriptor.value = value.map((v) => (isID(v) ? v : (v[options.field] as any).value || v[options.field]));
//     };

//     return {
//       ...descriptor,
//       get: () => ({
//         decorated: true,
//         value: descriptor.value,
//         attributes: GlobalContext.fieldAttributesMap[fieldHash] || {},
//         ...(!options.many && {
//           get: async (params?: Omit<QueryParams, 'model' | 'where'>, meta?: QueryMeta) => {
//             if (!options.field) {
//               return null;
//             }
//             // TODO: run checks
//             const model = target.__model__ as Model<T>;
//             if (!model) {
//               throw new Error('Not attached to a model'); // TODO: replace with actual implementation
//             }
//             if (!model.domain) {
//               throw new Error('Model has no domain'); // TODO: replace with actual implementation
//             }
//             return model.domain.get<T>(
//               {
//                 ...params,
//                 model: options.model,
//                 where: { [options.field]: descriptor.value },
//               },
//               meta,
//             );
//           },
//           set: setOne,
//         }),
//         ...(options.many && {
//           get: async (params?: Omit<QueryParams, 'model' | 'where'>, meta?: QueryMeta) => {
//             if (!options.field) {
//               return [];
//             }
//             // TODO: run checks
//             const model = target.__model__ as Model<T>;
//             if (!model) {
//               throw new Error('Not attached to a model'); // TODO: replace with actual implementation
//             }
//             if (!model.domain) {
//               throw new Error('Model has no domain'); // TODO: replace with actual implementation
//             }
//             if (!model.name) {
//               throw new Error('Model has no name'); // TODO: replace with actual implementation
//             }
//             return model.domain.getMany<T>(
//               {
//                 ...params,
//                 model: options.model,
//                 // TODO: where: { [options.field] in descriptor.value (an array) },
//               },
//               meta,
//             );
//           },
//           set: setMany,
//         }),
//       }),
//       set: (value: ID | ID[] | T | T[] | NullOrUndefined) => {
//         if (Array.isArray(value)) {
//           setMany(value);
//         } else {
//           setOne(value);
//         }
//       },
//     };
//   };
// }
