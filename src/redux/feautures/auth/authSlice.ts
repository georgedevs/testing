// src/redux/features/auth/authSlice.ts
import { AuthState, IUser } from "@/redux/types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
    token: "", // No longer used, kept for compatibility
    activationToken: "",
    user: null,
    isAuthenticated: false, // We'll determine this based on user object
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
          state.activationToken = action.payload.token;
      },
      userLoggedIn: (state, action: PayloadAction<{ user: IUser }>) => {
          // No longer store tokens in state since we're using cookies
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.isLoading = false;
      },
      userLoggedOut: (state) => {
          state.token = "";
          state.user = null;
          state.isAuthenticated = false;
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