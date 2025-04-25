import { useDispatch } from "react-redux";
import { change } from "redux-form";

export default function useFormSetValue(formName) {
  const dispatch = useDispatch();
  return (fieldName, newValue) => dispatch(change(formName, fieldName, newValue));
}