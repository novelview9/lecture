import dynamic from "next/dynamic";
import reset from "styled-reset";
import { ThemeProvider, createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    ${reset}
    line-height: 150%;
    letter-spacing: 0.12em;
    p {
        white-space: pre-wrap;
    }
@font-face {
  font-family: "Roboto";
  src:url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap')
}

@font-face {
  font-family: "Stint Ultra Condensed";
  src:url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&family=Stint+Ultra+Condensed&display=swap')
}
`;
const theme = {
    colors: {
        primary: "#0070f3",
    },
};

function App({ Component, pageProps }) {
    return (
        <>
            <GlobalStyle />
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
            </ThemeProvider>
        </>
    );
}

export default dynamic(() => Promise.resolve(App), {
    ssr: false,
});
