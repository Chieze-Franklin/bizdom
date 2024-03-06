// class GlobalContext {
//   static attributesMap: Record<string,  Record<string, any>> = {};
//   static fieldsMap: Record<string,  boolean> = {};
//   static addAttributes(name: string, attri: Record<string, any>) {
//     GlobalContext.attributesMap[name] = { ...(GlobalContext.attributesMap[name] || {}), ...attri }
//   }
// }

// function attribute(attri: Record<string, any>){
//   return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
//     console.log('>>>>>>1')
//     console.log(target.constructor.toString()) // TODO: store a hash of the target
//     console.log(`${target.constructor.name}.${propertyKey}`)
//     GlobalContext.addAttributes(`${target.constructor.name}.${propertyKey}`, attri);

//     return getNewDescriptor(target, propertyKey, descriptor);
//   };
// }

// function getNewDescriptor(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//   if (!GlobalContext.fieldsMap[`${target.constructor.name}.${propertyKey}`]) {
//     GlobalContext.fieldsMap[`${target.constructor.name}.${propertyKey}`] = true;

//     return {
//       ...descriptor,
//       get: () => {
//         return {
//           // for @attribute
//           attributes: GlobalContext.attributesMap[`${target.constructor.name}.${propertyKey}`] || {},
//         };
//       },
//     };
//   }
//   return descriptor;
// }

// const isGetter = (x, name) => (Object.getOwnPropertyDescriptor(x, name) || {}).get
// const isFunction = (x, name) => typeof x[name] === "function";
// const deepFunctions = x =>
//   x && x !== Object.prototype &&
//   Object.getOwnPropertyNames(x)
//     .filter(name => isGetter(x, name) || isFunction(x, name))
//     .concat(deepFunctions(Object.getPrototypeOf(x)) || []);
// const distinctDeepFunctions = x => Array.from(new Set(deepFunctions(x)));
// const getMethods = (obj) => distinctDeepFunctions(obj).filter(
//     name => name !== "constructor" && !~name.indexOf("__"));

// @reportableClassDecorator2
// class Az {
//   id?: number;
//   who = 'frank';
//   @attribute({id: true})
//   @attribute({type: 'STRING', database: 'db'})
//   get name(): any {
//     return;
//   }
//   method= ()=> {}
// }

// const aaa = new Az();
// aaa.id =12;
// console.log(Object.getOwnPropertyNames(aaa))
// console.log(getMethods(aaa))
// console.log(aaa.constructor.toString())
// console.log(aaa.name)
// console.log(aaa.name.attributes)

// const bbb = new Az();
// bbb.id =12;
// console.log(bbb.constructor.toString())
// console.log(bbb.name)
// console.log(bbb.name.attributes)
// console.log("aaa".constructor.toString())

// type OptionsFlags<Type> = {
//   [Property in keyof Type]: { get: () => void; } | Type[Property];
// };

// function reportableClassDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
//   return class extends constructor {
//     reportingURL = "http://www...";
//     title = {
//       get: () => { return "hahah" }
//     }
//   };
// }

// function reportableClassDecorator2<T extends { new (...args: any[]): {} }>(constructor: T) {
//   return constructor;
// }
 
// @reportableClassDecorator
// class BugReport implements OptionsFlags<BugReport> {
//   type = "report";
//   title: string;
 
//   constructor(t: string) {
//     this.title = t;
//   }
// }

// const bug: OptionsFlags<BugReport> = new BugReport("Needs dark mode");
// // console.log(bug.title);
// // console.log(bug.title.get()); // Prints "Needs dark mode"
// // console.log(bug.type); // Prints "report"
 
// // Note that the decorator _does not_ change the TypeScript type
// // and so the new property `reportingURL` is not known
// // to the type system:
// // console.log(bug.reportingURL);
