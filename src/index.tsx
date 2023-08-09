import { ChakraProvider, ChakraTheme, extendTheme } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import config from "./config/config";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      h4: {
        fontSize: { base: "2xl !important" },
        color: "black !important",
        fontFamily: "URW Gothic, sans-serif",
      },
    },
  },
  components: {
    Text: {
      baseStyle: {
        fontFamily: "Fraunces, sans-serif",
      },
    },
    Input: {
      baseStyle: {
        bg: "background !important",
        fontFamily: "Fraunces, sans-serif",
        _placeholder: {
          fontFamily: "Fraunces sans-serif",
        },
      },
    },
    FormLabel: {
      baseStyle: {
        fontWeight: "thin",
      },
    },
    Button: {
      baseStyle: {
        color: "black",
        fontWeight: "300 !important",
        bg: "#fff",
        _hover: {
          boxShadow: "rgba(99, 99, 99, 0.1) 0px 2px 8px 0px !important",
          transform: "translatey(-2px) scale(1.005)",
        },
      },
      variants: {
        formSelected: {
          border: "1px solid black !important",
          fontFamily: "Fraunces, sans-serif",
          color: "white !important",
          bg: "black !important",
        },
        selected: {
          bg: "black !important",
          color: "white !important",
        },
        secondary: {
          border: "1px solid !important",
          borderColor: "primary !important",
          fontFamily: "URW Gothic, sans-serif",
          color: "black !important",
          fontSize: "xs !important",
          bg: "background !important",
        },
        primary: {
          bg: "primary !important",
          fontFamily: "URW Gothic, sans-serif",
          fontSize: "xs !important",
        },
        form: {
          border: "1px solid black !important",
          fontFamily: "Fraunces, sans-serif",
          bg: "background !important",
        },
      },
    },
  },
  colors: config.colors,
} as Partial<ChakraTheme>);

const root = ReactDOM.createRoot(
  document.getElementById("price-calculator-root") as HTMLElement
);
root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
