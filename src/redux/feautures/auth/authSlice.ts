// src/redux/features/auth/authSlice.ts
import { AuthState, IUser } from "@/redux/types/auth";
import { tokenService } from "@/utils/tokenService";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
    token: tokenService.getAccessToken() || "",
    activationToken: "",
    user: null,
    isAuthenticated: tokenService.isAuthenticated(),
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
            tokenService.setToken(action.payload.accessToken);
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
        }
    },
});

export const { userRegistration, userLoggedIn, userLoggedOut, updateUserAvatar } = authSlice.actions;
export default authSlice.reducer;