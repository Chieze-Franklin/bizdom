import { getFieldHash, GlobalContext } from '../../global';

export function attribute(attribute: Record<string, any>) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const fieldHash = getFieldHash(target, propertyKey);

    GlobalContext.addFieldAttributes(fieldHash, attribute);

    if (!GlobalContext.fieldHasBeenDiscovered(fieldHash)) {
      GlobalContext.discoverField(fieldHash);

      return {
        ...descriptor,
        get: () => {
          return {
            attributes: GlobalContext.fieldAttributesMap[fieldHash] || {},
            decorated: true,
            get: () => descriptor.value,
            set: (value: any) => {
              descriptor.value = value;
            }
          };
        },
        set: (value: any) => {
          descriptor.value = value;
        }
      };
    }
    return descriptor;
  };
}
