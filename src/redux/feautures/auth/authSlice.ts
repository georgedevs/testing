// redux/features/auth/authSlice.ts
import { AuthState, IUser } from "@/redux/types/auth";
import { AuthStorage } from "@/utils/authStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  token: AuthStorage.getToken() || "",
  activationToken: "",
  user: AuthStorage.getUser() || null,
  isAuthenticated: !!AuthStorage.getToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.activationToken = action.payload.token;
    },
    userLoggedIn: (state, action: PayloadAction<{ accessToken: string; user: IUser }>) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      
      // Save to localStorage
      AuthStorage.saveToken(action.payload.accessToken);
      AuthStorage.saveUser(action.payload.user);
    },
    userLoggedOut: (state) => {
      state.token = "";
      state.user = null;
      state.isAuthenticated = false;
      
      // Clear localStorage
      AuthStorage.clear();
    },
    updateUserAvatar: (state, action: PayloadAction<{ avatarId: string; imageUrl: string }>) => {
      if (state.user) {
        state.user.avatar = {
          avatarId: action.payload.avatarId,
          imageUrl: action.payload.imageUrl
        };
        // Update localStorage
        AuthStorage.saveUser(state.user);
      }
    }
  },
});

export const { userRegistration, userLoggedIn, userLoggedOut, updateUserAvatar } = authSlice.actions;
export default authSlice.reducer;