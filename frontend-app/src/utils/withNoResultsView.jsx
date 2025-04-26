import { useDispatch } from 'react-redux';
import { useState } from 'react';

export const useDispatchWithLoading = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const dispatchWithLoading = async (action) => {
    try {
      setLoading(true);
      await dispatch(action);
    } finally {
      setLoading(false);
    }
  };

  return { dispatchWithLoading, loading };
};
