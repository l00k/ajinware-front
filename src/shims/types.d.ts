declare type PartRecord<K extends (string | number | symbol), V> = Partial<Record<K, V>>;

declare type PartialData<T> = {
    [K in keyof T]? : T[K] extends (arg : infer A) => void
        ? A
        : T[K];
};

declare type OptionalData<T> = Omit<Partial<T>, 'id'>;

declare type RecursivePartial<T> = T extends object
    ? { [P in keyof T]? : RecursivePartial<T[P]> }
    : T
    ;

declare type AnyFn<T = void> = (...args : any[]) => T;
declare type AsyncAnyFn<T = void> = (...args : any[]) => Promise<T>;
