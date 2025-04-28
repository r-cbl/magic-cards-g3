import _ from "lodash";

// Extend this class if you want your api results to expose more behaviour than plain JSON
// All your search results will be mapped to your custom resource

class Resource {
  constructor(fields) {
    _.assign(this, fields);
  }
}

export default Resource;