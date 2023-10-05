import { ChakraProvider, ChakraTheme, extendTheme } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import config from "./config/config";
import { QueryClientProvider, QueryClient } from "react-query";

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
        fontWeight: "300",
        borderRadius: "0.63em",
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
          padding: "2.2em 3.6em !important",
          textDecoration: "none",
          fontSize: ".75em !important",
          textTransform: "uppercase",
          letterSpacing: ".15em",
          fontWeight: "700 !important",
          lineHeight: "1.2em",
        },
        primary: {
          bg: "primary !important",
          fontFamily: "URW Gothic, sans-serif",
          padding: "2.2em 3.6em !important",
          textDecoration: "none",
          fontSize: ".75em !important",
          textTransform: "uppercase",
          letterSpacing: ".15em",
          fontWeight: "700 !important",
          lineHeight: "1.2em",
        },
        form: {
          border: "1px solid black !important",
          fontFamily: "Fraunces, sans-serif",
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
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: {
            queries: {
              refetchOnWindowFocus: false,
            },
          },
        })
      }
    >
      <App />
    </QueryClientProvider>
  </ChakraProvider>
);
