import _ from "lodash";
import format from "react-localize/lib/util.format";

export default (messages, key, values) => format(_.get(messages, key, key), values);