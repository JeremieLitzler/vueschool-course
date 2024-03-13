export default interface FirebaseResourcePropUnicityRequest<T> {
  collectionName: string;
  prop: string;
  value: T;
}
