export default function useSourceApi() {
  const apiUrlBase = 'https://jsonplaceholder.typicode.com';
  const apiUrlPostEndpoint = '/posts';
  const apiUrlUserEndpoint = '/users';

  return { apiUrlBase, apiUrlPostEndpoint, apiUrlUserEndpoint };
}
