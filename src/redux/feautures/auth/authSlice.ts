import { AuthState, IUser } from "@/redux/types/auth";
import { authService } from "@/utils/authService";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  user: null,
  isAuthenticated: authService.isLoggedIn(),
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      // Keep this for the registration flow
    },
    userLoggedIn: (state, action: PayloadAction<{ user: IUser }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      authService.setLoginStatus(true);
    },
    userLoggedOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      authService.clearLoginStatus();
    },
    updateUserAvatar: (state, action: PayloadAction<{ avatarId: string; imageUrl: string }>) => {
      if (state.user) {
        state.user.avatar = {
          avatarId: action.payload.avatarId,
          imageUrl: action.payload.imageUrl
        };
      }
    },
    updateUserTourStatus: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.tourViewed = action.payload;
      }
    }
  },
});

export const { 
  setLoading,
  userRegistration, 
  userLoggedIn, 
  userLoggedOut, 
  updateUserAvatar,
  updateUserTourStatus
} = authSlice.actions;
export default authSlice.reducer;