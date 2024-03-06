// function attribute(attri: Record<string, any>){
//   console.log('>>>>>>1')
//   return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
//     console.log('>>>>>>2')
//     console.log(attri)
//     // return {
//     //   ...descriptor,
//     //   attributes: descriptor.attributes ? { ...(descriptor.attributes || {}), attri } : attri,
//     //   get: () => {
//     //     console.log('>>>>>')
//     //     console.log(descriptor.attributes)
//     //     const res = ({
//     //       attributes: descriptor.attributes || attri,
//     //     })
//     //     console.log('>>>>>res', res)
//     //     return res;
//     //   },
      
//     // };
//   };
// }

// function relationship<T extends ModelDefinition>(name: string, options: { model: string, many?: boolean, fields?: Array<keyof T> }) {
//   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     // relationship extraction can happen header
//     // (target.__model__ as Model<T>)?.domain?.registerRelationship(name, { [T]: many ? 'many' : 'one' })
//     console.log('>>>>> relationship extraction can happen header')
//     console.log({ name, type: options.many ? 'many' : 'one', fields: options.fields, model: options.model, descriptor: descriptor.value })
//     return ({
//       ...descriptor,
//       ...(!options.many && {
//         get: () => {
//           return ({
//             value: descriptor.value,
//             async get() {
//               // console.log('>>>>>>(target.__model__ as Model<T>)', (target.__model__ as Model<T>))
//               console.log('>>>>>> get one object with ID', descriptor.value)
//               return (target.__model__ as Model<T>)?.domain?.get<T>()
//             },
//             async set(value: T) {
//               // return (target.prototype.domain.ge as Model<T>)t<T>()
//             }
//             // unset() break existing relationship // this.isSet = false;
//             // unset(value: T) explicitly specify the other object // this.isSet = false;
//           });
//         }
//       }),
//       ...(options.many && {
//         get: () => {
//           return ({
//             value: descriptor.value,
//             async get() {
//               // console.log('>>>>>>(target.__model__ as Model<T>)', (target.__model__ as Model<T>))
//               console.log('>>>>>> get many objects with IDs', descriptor.value)
//               return (target.__model__ as Model<T>)?.domain?.getMany<T>()
//             },
//             async set(value: Array<T>) {
//               // return (target as ModelDefinition).domain.get<T>()
//             }
//             // unset(value: Array<T>) this.isSet = false;
//           });
//         }
//       }),
//       set: (value: any) => {
//         descriptor.value = value;
//       }
//       // get: () => {
//       //   return ({
//       //     async get() {
//       //       if (options.many) {
//       //         return (target as ModelDefinition).domain.getMany<T>()
//       //       }
//       //       return (target as ModelDefinition).domain.getOne<T>()
//       //     }
//       //   });
//       // }
//     })
//   };
// }



// // ------

// interface DataAccessObject {
//   registerModel<T extends ModelDefinition>(name: string, definition: T): void;
// }

// // ---------- sequelize doa -------------
// class Sequelize {
//   define(name: string, model: Record<string, any>): void {}
// }

// class SequelizeDataAccessObject implements DataAccessObject {
//   sequelize = new Sequelize();

//   registerModel<T extends ModelDefinition>(name: string, definition: T): void {
//     const seqModel: Record<string, any> = {};
//     Object.keys(definition).forEach((key) => {
//       seqModel[key] = {
//         type: typeof (definition as Record<string, any>)[key] === 'string' ? 'STRING' : 'INTEGER',
//       };
//     })
//     this.sequelize.define(name, seqModel);
//   }
// }

// // ---------- api doa -------------
// class ApiDataAccessObject implements DataAccessObject {
//   models: Map<string, ModelDefinition> = new Map();

//   registerModel<T extends ModelDefinition>(name: string, definition: T): void {
//     this.models.set(name, definition);
//   }
// }

// // -----
// type ID = string | number;

// const isID = (value: any): value is ID => {
//     if(typeof value === 'string' || typeof value === 'number'){
//       return true
//     }
//     return false
// }

// type Relationship<T extends ModelDefinition> = undefined | {
//   get(): Promise<T | Array<T> | undefined>;
//   set(value: T | Array<T>): void;
// };
// type One<T extends ModelDefinition> = undefined | {
//   get(): Promise<T | null | undefined>;
//   set(value: ID | T | null | undefined): void;
//   value: ID | T | null | undefined;
// };
// type OneValue<T extends ModelDefinition> = ID | T | undefined;
// type Many<T extends ModelDefinition> = undefined | {
//   get(): Promise<Array<T>>;
//   set(value: Array<ID> | Array<T>): void;
//   value: Array<ID> | Array<T>;
// };
// type ManyValues<T extends ModelDefinition> = Array<ID> | Array<T>;

// class Domain {
//   constructor(private dataAccessObjects: Array<DataAccessObject> = []) {
//     //
//   }

//   modelMap: Record<string, Model<ModelDefinition>> = {};

//   registerModel<T extends ModelDefinition>(name: string, model: Model<T>) {
//     // set model info
//     model.domain = this;

//     this.modelMap[name] = model;

//     // extract relationships

//     // pass model to doas
//     this.dataAccessObjects.forEach((doa) => doa.registerModel(name, new model.definitionType()));
//   }

//   // checks
//   // hooks

//   async getMany<T extends ModelDefinition>() : Promise<Array<T>> {
//     console.log('>>>>called domain.getMany')
//     return [];
//   }
//   async get<T extends ModelDefinition>() : Promise<T|undefined> {
//     console.log('>>>>called domain.get')
//     return undefined;
//   }
//   async getManyOfMy<T extends ModelDefinition>(model: string, id: string) : Promise<Array<T>> {
//     return [];
//   }
//   async getMy<T extends ModelDefinition>(model: string, id: string) : Promise<T|undefined> {
//     return undefined;
//   }
// }

// abstract class Model<T extends ModelDefinition> {
//   // name: string
//   domain: Domain | undefined;
//   // definition: T;
//   // constructor(type: (new () => T) | T) {
//   //   if (typeof type === 'object') {
//   //     this.definition = type as T;
//   //   } else {
//   //     this.definition = new type();
//   //   }
//   // }

//   constructor(public definitionType: (new () => T)) {
//     this.definitionType.prototype.__model__ = this;
//   }

//   create(definition: Partial<T>) : T & ModelInstance<T> {
//     // run model checks

//     // run pre hooks

//     // pass to domain

//     // run post hooks

//     // return created object
//     const result = new this.definitionType();
//     Object.keys(definition).forEach((key: string) => (result as any)[key] = (definition as any)[key]);

//     const instance : ModelInstance<T> = Object.create(result);
//     instance.update = async () => {
//       // instance checks ??
//       // instance pre hooks
//       // pass to model
//       // instance post hooks
//       return instance as T & ModelInstance<T>;
//     }
//     instance.delete = async () => { return 2 }

//     return instance as T & ModelInstance<T>;
//   }

//   // update(id: string | number, definition: Partial<T>) : Partial<T> {}
// }

// interface ModelDefinition {
//   // [key: string]: any;
//   // __model__: Model<ModelDefinition> | undefined;
// }

// interface IdModelDefinition extends ModelDefinition {
//   id: string
// }

// interface TimestampModelDefinition extends ModelDefinition {
//   createdAt: Date;
//   updatedAt: Date;
// }

// interface ModelInstance<T extends ModelDefinition> {
//   update(): Promise<T & ModelInstance<T>>;
//   delete(): Promise<number>;
// }

// class UserModelDefinition implements IdModelDefinition, TimestampModelDefinition {
//   id: string = '';
//   name: string = '';
//   method = () => {};
//   @attribute({type: 'STRING', database: 'db'})
//   @relationship<ProfileModelDefinition>('user_profile', { many:true, fields: ['id'], model: 'Profile' })
//   get profile(): Many<ProfileModelDefinition> {
//     return;
//   };
//   set profile(value) {}
//   createdAt: Date = new Date();
//   updatedAt: Date = new Date();
// }

// class ProfileModelDefinition implements IdModelDefinition, TimestampModelDefinition {
//   id: string = '';
//   bio: string = '';
//   @relationship<UserModelDefinition>('user_profile', { fields: ['id'], model: 'User' })
//   get user(): One<UserModelDefinition> {
//     return;
//   };
//   set user(value) {}
//   createdAt: Date = new Date();
//   updatedAt: Date = new Date();
// }

// class User extends Model<UserModelDefinition> { }

// class Profile extends Model<ProfileModelDefinition> { }

// const s = new SequelizeDataAccessObject();
// const a = new ApiDataAccessObject();

// const domain = new Domain([a, s]);

// const userModel = new User(UserModelDefinition);
// domain.registerModel('User', userModel);
// const user = userModel.create({ name: 'Frank'});
// // console.log(user)
// // console.log('user.profile:', user.profile)
// // @ts-ignore
// user.profile = ['12345', '67890']
// console.log('user.profile.value:', user.profile?.value)
// console.log('user.profile?.get():', user.profile?.get())
// // user.profile?.get().then(() => console.log('>>>>returned from user.profile? promise'))

// const profileModel = new Profile(ProfileModelDefinition);
// domain.registerModel('Profile', profileModel);
// const profile = profileModel.create({});
// // console.log(profile)
// profile.id = 'sss';
// // console.log('profile.user:', profile.user)
// // @ts-ignore
// profile.user = 'abcd'
// console.log('profile.user?.get():', profile.user?.get())
// // profile.user?.get().then(() => console.log('>>>>returned from profile.user? promise'))

// console.log(isID(1))
// console.log(isID('1'))
// console.log(isID(true))
// console.log(isID(user))

// // function isOftype<T>(value: any, t: (new() => T)): value is T {
// //   const k = new t();
// //   type kk = keyof T;
// //   type kkk = keyof typeof value;

// //   const same = Object.keys((k as any)).reduce((agg, key) => {
// //     agg = agg && (typeof value[key] == typeof (k as any)[key]);
// //     return agg;
// //   }, true);

// //   return same;
// // }

// // // type AAA = {a: string; b:number}
// // class AAA {}
// // const aaa = {}
// // const bbb = {a: '111', b: 12, c: false}
// // const ccc = {a: '111'}
// // const ddd = {a: false, b: '12'}
// // console.log(isOftype(aaa, AAA));

// // // -------------------
// // const animals = ['cat', 'dog', 'mouse'] as const
// // type Animal = typeof animals[number]
// // const aa : Animal = "cat";

// // function az(){
// //   return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {};
// // }

// // type decorator = () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {}

// // let bz: decorator;

// // class Az {
// //   @bz()
// //   name(){}
// // }
