import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useCalculatorStore } from "../app/calculator_store";
import config from "../config/config";

const InformationCard = () => {
  const { settings, prices, priceConfig } = useCalculatorStore();

  const hours =
    (settings.time?.until.getHours() ?? 0) -
    (settings.time?.from.getHours() ?? 0);

  const values = [
    {
      label: `Miete für Bootsfahrt ${hours}h`,
      value: `${prices.rent}€`,
    },
    { label: `Bootsfahrt für ${hours}h`, value: "inklusive" },
    {
      label: `Benzin für Bootsfahrt für ${hours}h`,
      value: "inklusive",
    },
    { label: `Strom und Heizkosten`, value: "inklusive" },
    { label: `Musikanlage`, value: "inklusive" },
    {
      label: `1x Eventmanager für ${hours}h`,
      value: "inklusive",
    },
    {
      label: `1x Service-Personal für ${hours}h`,
      value: "inklusive",
    },
    {
      label: `Getränkepauschale für ${settings.persons} Personen`,
      value: `${prices.drinks}€`,
    },
    {
      label: `Fingerfood Buffet Catering für ${settings.persons} Personen`,
      value: `${prices.catering}€`,
    },
    { label: `Reinigungspauschale`, value: `${prices.cleaning}€` },
    { label: `Skipper (extern) für ${hours}h`, value: `${prices.skipper}€` },
    { label: "Sonderwünsche", value: "nach Absprache" },
  ];

  return (
    <Stack
      maxW={config.sizes.sliderWidth}
      minW={"300px"}
      w="full"
      minH={config.sizes.sliderHeight}
      //   boxShadow="rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;"
      borderRadius="12px"
      overflow="hidden"
      p="40px 30px"
      justify="space-between"
      flex="5"
    >
      <Heading as="h4" textAlign="center" mb="15px">
        Dein vorrausichtlicher Preis:
      </Heading>
      <Stack mb="30px">
        {values.map((value, index) => {
          return (
            <Flex
              align="center"
              justify="space-between"
              bg={index % 2 === 0 ? undefined : `surface`}
              gap="20px"
              w="full"
              p="5px"
            >
              <Text fontSize="xs">{value.label}</Text>
              <Text fontSize="xs">{value.value}</Text>
            </Flex>
          );
        })}
      </Stack>
      <Stack align="center" gap="-10px">
        <Heading as="h4" textAlign="center">
          {
            new Intl.NumberFormat("de-DE", {
              style: "currency",
              currency: "EUR",
            })
              .format(prices.total)
              .split(",")[0]
          }
          €
        </Heading>
        <Text fontSize="sm" fontWeight="normal">
          Preis p.P.{" "}
          {
            new Intl.NumberFormat("de-DE", {
              style: "currency",
              currency: "EUR",
            })
              .format(prices.perPerson)
              .split(",")[0]
          }
          €
        </Text>
        <Text fontSize="sm" fontWeight="thin">
          zzgl. MwSt.
        </Text>
      </Stack>
    </Stack>
  );
};

export default InformationCard;
