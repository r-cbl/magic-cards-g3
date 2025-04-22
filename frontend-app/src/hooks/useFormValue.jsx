import _ from "lodash";
import { useSelector } from "react-redux";
import useFormSetValue from "./useFormSetValue";

export default function useFormValue(formName, fieldName) {
  const setValue = useFormSetValue(formName);
  const form = useSelector((state) => state.form);
  const value = _.get(form, `${formName}.values.${fieldName}`);

  return [value, (newValue) => setValue(fieldName, newValue)];
}