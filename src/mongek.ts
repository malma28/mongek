const MarshalerKey = "marshaler";

interface MarshalerField {
    name: string;
    ignored: boolean;
    required: boolean;
    only?: (value: any) => boolean;
    must?: (value: any) => boolean;
}

interface Marshaler {
    fields?: {[key: string]: MarshalerField};
}

export function field(name: string, required: boolean) {
    return function(field: Object, fieldName: string) {
        let marshalerProperty = Object.getOwnPropertyDescriptor(field.constructor, MarshalerKey);
        let marshaler: Marshaler = {fields: {}};
        if(marshalerProperty !== undefined) {
            marshaler = marshalerProperty.value as Marshaler;
            if(marshaler === null || marshaler === undefined) return;
        }
        let marshalerField = marshaler.fields[fieldName];
        if(marshalerField === undefined) marshalerField = {name: fieldName, ignored: false, required: false};
        marshalerField.name = name;
        marshalerField.required = required;
        marshaler.fields[fieldName] = marshalerField;
        Object.defineProperty(field.constructor, MarshalerKey, {value: marshaler});
    }
}

export function ignored() {
    return function(field: Object, fieldName: string) {
        let marshalerProperty = Object.getOwnPropertyDescriptor(field.constructor, MarshalerKey);
        let marshaler: Marshaler = {fields: {}};
        if(marshalerProperty !== undefined) {
            marshaler = marshalerProperty.value as Marshaler;
            if(marshaler === null || marshaler === undefined) return;
        }
        let marshalerField = marshaler.fields[fieldName];
        if(marshalerField === undefined) marshalerField = {name: fieldName, ignored: false, required: false};
        marshalerField.ignored = true;
        marshaler.fields[fieldName] = marshalerField;
        Object.defineProperty(field.constructor, MarshalerKey, {value: marshaler});
    }
}

export function only(callback: (value: any) => boolean) {
    return function(field: Object, fieldName: string) {
        let marshalerProperty = Object.getOwnPropertyDescriptor(field.constructor, MarshalerKey);
        let marshaler: Marshaler = {fields: {}};
        if(marshalerProperty !== undefined) {
            marshaler = marshalerProperty.value as Marshaler;
            if(marshaler === null || marshaler === undefined) return;
        }
        let marshalerField = marshaler.fields[fieldName];
        if(marshalerField === undefined) marshalerField = {name: fieldName, ignored: false, required: false};
        marshalerField.must = undefined;
        marshalerField.only = callback;
        marshaler.fields[fieldName] = marshalerField;
        Object.defineProperty(field.constructor, MarshalerKey, {value: marshaler});
    }
}

export function must(callback: (value: any) => boolean) {
    return function(field: Object, fieldName: string) {
        let marshalerProperty = Object.getOwnPropertyDescriptor(field.constructor, MarshalerKey);
        let marshaler: Marshaler = {fields: {}};
        if(marshalerProperty !== undefined) {
            marshaler = marshalerProperty.value as Marshaler;
            if(marshaler === null || marshaler === undefined) return;
        }
        let marshalerField = marshaler.fields[fieldName];
        if(marshalerField === undefined) marshalerField = {name: fieldName, ignored: false, required: false};
        marshalerField.only = undefined;
        marshalerField.must = callback;
        marshaler.fields[fieldName] = marshalerField;
        Object.defineProperty(field.constructor, MarshalerKey, {value: marshaler});
    }
}

export function marshal(obj: Object): string | null {
    let marshalerProperty = Object.getOwnPropertyDescriptor(obj.constructor, MarshalerKey);
    if(marshalerProperty === undefined) return null;
    let marshaler: Marshaler = marshalerProperty.value as Marshaler;
    if(marshaler === null || marshaler === undefined) return null;
    const data = {};
    Object.getOwnPropertyNames(obj).forEach(fieldName => {
        const fieldValue = Object.getOwnPropertyDescriptor(obj, fieldName);
        if(fieldName in marshaler.fields) {
            const field = marshaler.fields[fieldName];
            if(field.name === null || field.name === undefined || field.ignored) return;
            if(field.required && (fieldValue.value === undefined || fieldValue.value === null)) {
                throw new Error(`Field ${fieldName} is required`);
            }
            if(field.only !== undefined) {
                if(!field.only(fieldValue.value)) return;
            } else if(field.must !== undefined) {
                if(!field.must(fieldValue.value)) return;
            }
            data[marshaler.fields[fieldName].name] = fieldValue.value;
        }
        else data[fieldName] = fieldValue.value;
    });
    return JSON.stringify(data);
}
