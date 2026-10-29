import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '../lib/api';
import { logout } from '../app/store';

export function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const qc = useQueryClient();

  return async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors — still clear client state
    } finally {
      dispatch(logout());
      qc.clear();
      toast.success('Logged out');
      navigate('/login', { replace: true });
    }
  };
}