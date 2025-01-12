import React, { StrictMode } from "react"
import { Provider } from "react-redux"
import { store } from "@/redux/store"
import { ThemeProvider } from "next-themes"
import AuthWrapper from "./AuthWrapper"
import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <StrictMode>
            <Provider store={store}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={true}
                    disableTransitionOnChange
                >
                    <AuthWrapper>
                        {children}
                        <Toaster 
                            closeButton 
                            position="bottom-right"
                            theme="dark"
                            style={{
                                background: 'black',
                                color: 'white',
                            }}
                        />
                    </AuthWrapper>
                </ThemeProvider>
            </Provider>
        </StrictMode>
    )
}
