import {
  Divider,
  Flex,
  Spinner,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import InformationCard from "./components/information-card";
import Pagination from "./components/pagination";
import Slider from "./components/slider";
import config from "./config/config";
import "./index.css";
import { useMutation } from "react-query";
import { getMonthPricing } from "./config/sanity";
import { useCalculatorStore } from "./app/calculator_store";
import { useEffect } from "react";

function App() {
  const setPriceConfig = useCalculatorStore((state) => state.setPriceConfig);

  const { isLoading: priceConfigLoading, mutate: fetchPriceConfig } =
    useMutation({
      mutationFn: async (date: Date) => {
        const month = new Intl.DateTimeFormat("en-GB", { month: "long" })
          .format(date)
          .toLowerCase();
        const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "long" })
          .format(date)
          .toLowerCase();

        return await getMonthPricing(month, weekday);
      },
      onSuccess(data) {
        setPriceConfig(data);
      },
    });

  useEffect(() => {
    fetchPriceConfig(new Date());

    const unsubscribe = useCalculatorStore.subscribe((state, prev) => {
      if (state.settings.date === prev.settings.date || !state.settings.date)
        return;

      fetchPriceConfig(state.settings.date);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const dividerOrientation = useBreakpointValue({
    base: "horizontal",
    md: "vertical",
  });

  return (
    <Flex w="full" minH="600px" justify="center" alignItems="center">
      {priceConfigLoading ? (
        <Spinner />
      ) : (
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
              orientation={
                dividerOrientation as "horizontal" | "vertical" | undefined
              }
              borderColor="black"
              borderWidth="1.5px"
            />
          </Flex>

          <InformationCard />
        </Flex>
      )}
    </Flex>
  );
}

export default App;
