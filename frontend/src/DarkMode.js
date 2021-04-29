// Much of this code is borrowed from https://www.codingforentrepreneurs.com/blog/dark-mode-hook-reactjs
// who taught me the beginnings of React Context and Providers

import React from 'react'

const defaultContextData = {
    dark: false,
    toggle: () => { }
};

const DarkModeContext = React.createContext(defaultContextData);
export const useDarkMode = () => React.useContext(DarkModeContext);

const useEffectDarkMode = () => {
    const [darkModeState, setDarkModeState] = React.useState({
        dark: false,
        hasDarkModeMounted: false
    });
    React.useEffect(() => {
        // remember our current dark mode status in the browser local storage
        const localStorageDark = localStorage.getItem("dark") === "true";
        // document.body.classList.add('bg-dark', 'text-light');
        // document.body.classList.remove('bg-light', 'text-dark');

        setDarkModeState({ dark: localStorageDark, hasDarkModeMounted: true });
    }, []);

    return [darkModeState, setDarkModeState];
};

export const DarkModeProvider = ({ children }) => {
    const [darkModeState, setDarkModeState] = useEffectDarkMode();

    if (!darkModeState.hasDarkModeMounted) {
        return <div />;
    }

    const toLightMode = () => {
        if (darkModeState.dark) {
            toggle()
        }
    }
    const toDarkMode = () => {
        if (!darkModeState.dark) {
            toggle()
        }
    }
    const toggle = () => {
        const dark = !darkModeState.dark;
        // remember our current dark mode status in the browser local storage
        localStorage.setItem("dark", JSON.stringify(dark));

        if (dark) {
            document.body.classList.add('bg-dark', 'text-light', 'card-dark');
            document.body.classList.remove('bg-light', 'text-dark', 'card');
        } else {
            document.body.classList.add('bg-light', 'text-dark', 'card');
            document.body.classList.remove('bg-dark', 'text-light', 'card-dark');
        }

        setDarkModeState({ ...darkModeState, dark, bgColor: "#fff", textColor: "#212529" });
    };
    return (
        <DarkModeContext.Provider
            value={{
                dark: darkModeState.dark,
                toDark: toDarkMode,
                toLight: toLightMode,
                toggle: toggle
            }}
        >
            {children}
        </DarkModeContext.Provider>
    );
};
