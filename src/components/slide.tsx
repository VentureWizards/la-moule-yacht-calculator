import { Heading, Stack } from "@chakra-ui/react";
import { easeInOut, motion, Variants } from "framer-motion";
import { FunctionComponent, ReactNode, useMemo } from "react";
import { SlideDirection, useAnimationStore } from "../app/animation_store";
import { useCalculatorStore } from "../app/calculator_store";
import config from "../config/config";

interface SlideProps {
  children: ReactNode;
  title: string;
}

const Slide: FunctionComponent<SlideProps> = ({ children, title }) => {
  const { slideDirection } = useAnimationStore();

  const variants: Variants = {
    initial: {
      x: `${slideDirection === SlideDirection.next ? "" : "-"}${
        config.sizes.sliderWidth
      }`,
    },
    animate: {
      x: 0,
    },
    exit: {
      x: `${slideDirection === SlideDirection.next ? "-" : ""}${
        config.sizes.sliderWidth
      }`,
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2 }}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Stack
        h="full"
        w="full"
        p="40px 30px"
        gap="35px"
        textAlign="center"
        justify="flex-start"
      >
        <Heading as="h4">{title}</Heading>
        {children}
      </Stack>
    </motion.div>
  );
};
export default Slide;
