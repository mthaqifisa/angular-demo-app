import { User } from '../../services/auth.service';

export interface AuthState {
  user: User | null;     // The authenticated user or null if not authenticated
  loading: boolean;      // Indicates if an authentication operation is in progress
  error: string | null;  // Error message if authentication fails
}

export const initialAuthState: AuthState = {
  user: null,
  loading: false,
  error: null
};
