import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  SimpleGrid,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Slider as ChakraSlider,
  Text,
} from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import {
  getButtonTextFromOccasion,
  Occasion,
  useCalculatorStore,
} from "../app/calculator_store";
import Slide from "./slide";
import DatePicker, { CalendarContainer } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";

import { Formik, Field } from "formik";
import config from "../config/config";

const Slider = () => {
  const {
    pageIndex,
    settings,
    setSettings,
    setCanSubmit,
    setFormValues,
    formValues,
  } = useCalculatorStore();

  const validate = (values: any) => {
    setFormValues(values);
    setCanSubmit(false);

    const { name, email, phone } = values;
    const errors: any = {};

    if (!name || name.trim().length === 0) {
      errors.name = "Name wird benötigt";
    } else if (!email || email.trim().length === 0) {
      errors.email = "E-Mail wird benötigt";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      errors.email = "E-Mail Adresse scheint nicht korrekt zu sein";
    } else if (!phone || phone.trim().length === 0) {
      errors.phone = "Telefonnummer wird benötigt";
    }

    if (Object.keys(errors).length === 0) setCanSubmit(true);

    return errors;
  };

  const slides = [
    <Slide title="Für welchen Anlass?" key={`calculator-slide-0`}>
      <SimpleGrid columns={2} spacing="15px">
        {Object.values(Occasion).map((occasion) => (
          <Button
            variant={settings.occasion === occasion ? "formSelected" : "form"}
            // eslint-disable-next-line no-sequences
            onClick={() => setSettings({ occasion })}
          >
            {getButtonTextFromOccasion(occasion)}
          </Button>
        ))}
      </SimpleGrid>
    </Slide>,
    <Slide
      title="Wann willst du das Eventboot buchen?"
      key={`calculator-slide-1`}
    >
      <FormControl>
        <FormLabel>Datum</FormLabel>
        <Box className="light-theme-original">
          <DatePicker
            selected={settings.date}
            onChange={(date) => {
              if (!date) return;

              const from = new Date(date.toDateString());
              const until = new Date(date.toDateString());

              from.setHours(config.defaults.time.from.getHours());
              until.setHours(config.defaults.time.until.getHours());

              setSettings({
                time: {
                  from,
                  until,
                },
                date: date,
              });
            }}
            showPopperArrow={true}
            withPortal
            value={settings.date?.toDateString().replaceAll("/", ".")}
          ></DatePicker>
        </Box>
      </FormControl>
      <FormControl>
        <FormLabel>Uhrzeit</FormLabel>

        <RangeSlider
          isDisabled={!settings.date}
          min={9}
          max={21}
          minStepsBetweenThumbs={4}
          defaultValue={[12, 16]}
          onChange={(value) => {
            if (!settings.date) return;

            const from = new Date(settings.date.toDateString());
            const until = new Date(settings.date.toDateString());

            from.setHours(value[0]);
            until.setHours(value[1]);

            setSettings({
              time: {
                from,
                until,
              },
            });
          }}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack bg="#555" />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
        <Flex justify="space-between">
          <Text>{settings.time?.from.getHours()} Uhr</Text>
          <Text>{settings.time?.until.getHours()} Uhr</Text>
        </Flex>
      </FormControl>
    </Slide>,
    <Slide title="Für wie viele Personen?" key={`calculator-slide-2`}>
      <FormControl>
        <FormLabel>Personen</FormLabel>

        <ChakraSlider
          isDisabled={!settings.date}
          min={10}
          max={45}
          defaultValue={10}
          value={settings.persons}
          onChange={(value) => {
            setSettings({
              persons: value,
            });
          }}
        >
          <SliderTrack>
            <SliderFilledTrack bg="#555" />
          </SliderTrack>
          <SliderThumb />
        </ChakraSlider>
        <Flex justify="space-between">
          <Text>{settings.persons} Personen</Text>
        </Flex>
      </FormControl>
    </Slide>,
    <Slide title="Catering dazubuchen?" key={`calculator-slide-3`}>
      <Text>
        Für jedes Event bieten wir standardmäßig eine Getränkepauschale.
        Möchtest Du auch ein Fingerfood Buffet Catering dazu buchen?
      </Text>
      <SimpleGrid columns={2} spacing="15px">
        <Button
          variant={!settings.catering ? "formSelected" : "form"}
          // eslint-disable-next-line no-sequences
          onClick={() => setSettings({ catering: false })}
        >
          Nein
        </Button>
        <Button
          variant={settings.catering ? "formSelected" : "form"}
          // eslint-disable-next-line no-sequences
          onClick={() => setSettings({ catering: true })}
        >
          Ja
        </Button>
      </SimpleGrid>
    </Slide>,
    <Slide title="Deine Angaben" key={`calculator-slide-4`}>
      <Formik
        initialValues={formValues}
        onSubmit={(values) => {}}
        validate={validate}
        validateOnChange
      >
        {({}) => (
          <form>
            <Stack gap="10px">
              <Field
                as={Input}
                name="name"
                type="text"
                placeholder="Vor- / Nachname"
              />

              <Field
                as={Input}
                name="email"
                type="email"
                placeholder="E-Mail Adresse"
              />

              <Field
                as={Input}
                name="phone"
                type="tel"
                placeholder="Telefonnummer"
              />

              <Field
                as={Input}
                name="company"
                type="text"
                placeholder="Firmenname (Optional)"
              />
            </Stack>
          </form>
        )}
      </Formik>
    </Slide>,
    <Slide title="" key={`calculator-slide-5`}>
      <Stack h="full" justify="center" align="center">
        <Heading as="h4">ANFRAGE ABGESENDET</Heading>
        <Text>Wir melden uns in kürze bei dir.</Text>
      </Stack>
    </Slide>,
  ];

  return (
    <Box
      maxW={config.sizes.sliderWidth}
      minW={"300px"}
      w="full"
      minH={config.sizes.sliderHeight}
      transition="300ms ease"
      borderRadius="12px"
      overflow="hidden"
    >
      <AnimatePresence mode="wait">
        {slides.map((element, i) => {
          if (pageIndex !== i) {
            return null;
          }

          return element;
        })}
      </AnimatePresence>
    </Box>
  );
};

export default Slider;
