// src/redux/features/auth/authSlice.ts
import { AuthState, IUser } from "@/redux/types/auth";
import { tokenService } from "@/utils/tokenService";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
    token: tokenService.getAccessToken() || "",
    activationToken: "",
    user: null,
    isAuthenticated: tokenService.isAuthenticated(),
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
      userLoggedIn: (state, action: PayloadAction<{ accessToken: string; refreshToken: string; user: IUser }>) => {
          state.token = action.payload.accessToken;
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.isLoading = false;
          // Store both tokens
          tokenService.setTokens(action.payload.accessToken, action.payload.refreshToken);
      },
      userLoggedOut: (state) => {
          state.token = "";
          state.user = null;
          state.isAuthenticated = false;
          tokenService.clearTokens();
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