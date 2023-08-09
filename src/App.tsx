import {
  ChakraProvider,
  ChakraTheme,
  Divider,
  extendTheme,
  Flex,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import InformationCard from "./components/information-card";
import Pagination from "./components/pagination";
import Slider from "./components/slider";
import config from "./config/config";
import "./index.css";

function App() {
  return (
    <Flex
      w="100vw"
      minH="600px"
      bg="background"
      justify="center"
      alignItems="center"
    >
      <Flex
        w="full"
        justify="space-between"
        align={{ base: "center", md: "unset" }}
        maxW={config.sizes.contentMaxWidth}
        flexDir={{ base: "column", md: "row" }}
      >
        <Stack pos="relative" alignItems="center" gap="30px" flex="5">
          <Slider />
          <Pagination />
        </Stack>

        <Flex h="inherit" w="inherit" p="20px" flex="1" justify="center">
          <Divider
            orientation={useBreakpointValue({
              base: "horizontal",
              md: "vertical",
            })}
            borderColor="black"
            borderWidth="1.5px"
          />
        </Flex>

        <InformationCard />
      </Flex>
    </Flex>
  );
}

export default App;
