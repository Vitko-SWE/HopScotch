// Much of this code is borrowed from https://www.codingforentrepreneurs.com/blog/text-mode-hook-reactjs
// who taught me the beginnigns of React Context and Providers

import React from 'react'

const defaultContextData = {
    text: false,
    toggle: () => { }
};

const TextModeContext = React.createContext(defaultContextData);
export const useTextMode = () => React.useContext(TextModeContext);

const useEffectTextMode = () => {
    const [textModeState, setTextModeState] = React.useState({
        text: false,
        hasTextModeMounted: false
    });
    React.useEffect(() => {
        // remember our current text mode status in the browser local storage
        const localStorageText = localStorage.getItem("text") === "true";

        setTextModeState({ text: localStorageText, hasTextModeMounted: true });
    }, []);

    return [textModeState, setTextModeState];
};

export const TextModeProvider = ({ children }) => {
    const [textModeState, setTextModeState] = useEffectTextMode();

    if (!textModeState.hasTextModeMounted) {
        return <div />;
    }

    const toLightMode = () => {
        if (textModeState.text) {
            toggle()
        }
    }
    const toTextMode = () => {
        if (!textModeState.text) {
            toggle()
        }
    }
    const toggle = () => {
        const text = !textModeState.text;
        // remember our current text mode status in the browser local storage
        localStorage.setItem("text", JSON.stringify(text));

        if (text) {
            document.body.classList.add('text-big');
        } else {
            document.body.classList.remove('text-big');
        }

        setTextModeState({ ...textModeState, text, bgColor: "#fff", textColor: "#212529" });
    };
    return (
        <TextModeContext.Provider
            value={{
                text: textModeState.text,
                toText: toTextMode,
                toLight: toLightMode,
                toggle: toggle
            }}
        >
            {children}
        </TextModeContext.Provider>
    );
};
