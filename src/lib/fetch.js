import { api } from '../front_config';

export function streamsUrl(url) {
  const splitUrl = url.split('?');
  const query = !!splitUrl[1] ? '&' + splitUrl[1] : '';
  const route = splitUrl[0];

  return `${api}${route}?${query}`;
}

export default async function pixel8Fetch(route, options) {
  let headers = {};
  if (options && options.headers) headers = options.headers;

  return fetch(`${api}${route}`, { ...options, headers })
    .then(r => {
      if (!r.ok && r.status === 401) {
        window.location = '/#login';
      }
      return r;
    });
}
