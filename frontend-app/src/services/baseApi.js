import axios from "axios";
import querystring from "querystring";
import Promise from "bluebird";
import Resource from "./resources/resource";

class BaseApi {
  constructor({ resource = "", token, Type = Resource, http, baseUrl }) {
    this.Type = Type;
    const defaultBaseUrl = `http://localhost:3001/api`;
    this.http =
      http ||
      axios.create({
        baseURL: `${baseUrl || defaultBaseUrl}/${resource}`,
        headers: { authorization: /bearer/gi.test(token) ? token : `Bearer ${token}` },
      });
  }

  setResource(resource = "" ) {
    this.resource = resource;
  }

  get(path = "", query = {}) {
    const url = `${path}?${querystring.stringify(query)}`;
    return this._getData(this.http.get(url));
  }

  put(path = "", body = {}, query = {}) {
    return this._request(path, body, query, "put");
  }

  post(path = "", body = {}, query = {}) {
    return this._request(path, body, query, "post");
  }

  delete(path = "", query = {}) {
    const url = `${path}?${querystring.stringify(query)}`;
    return this._getData(this.http.delete(url));
  }

  head(path = "", query = {}) {
    const url = `${path}?${querystring.stringify(query)}`;
    return this.http.head(url);
  }

  getMany(options) {
    return this._toResources(this.get("", options));
  }

  search(options) {
    return this._toResources(this.get("search", this._getSearchOptions_(options)));
  }

  _request(path, body, query, verb) {
    const url = `${path}?${querystring.stringify(query)}`;
    return this._getData(this.http[verb](url, body));
  }

  _getData($request) {
    return Promise.resolve($request).get("data");
  }

  _getSearchOptions_(options) {
    return options;
  }

  _toResources($response) {
    return $response.then(({ count, results }) => {
      return {
        count,
        results: results.map((it) => new this.Type(it)),
      };
    });
  }

}

export default BaseApi;