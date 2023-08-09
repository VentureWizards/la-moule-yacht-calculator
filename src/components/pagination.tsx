import { Button, Flex, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useCalculatorStore } from "../app/calculator_store";
import { SlideDirection, useAnimationStore } from "../app/animation_store";

const Pagination = () => {
  const {
    maxIndex,
    pageIndex,
    allowedIndex,
    nextPage,
    previousPage,
    canSubmit,
    submitForm,
  } = useCalculatorStore();
  const { setSlideDirection } = useAnimationStore();

  return (
    <Flex w="full" h="80px" justifyContent="center" gap="30px">
      {pageIndex !== maxIndex && (
        <>
          {" "}
          <Button
            aria-label="Previous"
            isDisabled={pageIndex === 0}
            onClick={previousPage}
            onMouseEnter={() => setSlideDirection(SlideDirection.prev)}
            variant="secondary"
          >
            ZURÜCK
          </Button>
          <Button
            aria-label="Next"
            isDisabled={
              pageIndex === maxIndex - 1
                ? !canSubmit
                : pageIndex === allowedIndex
            }
            onClick={async () => {
              if (pageIndex === maxIndex - 1) await submitForm();
              nextPage();
            }}
            onMouseEnter={() => setSlideDirection(SlideDirection.next)}
            variant="primary"
          >
            {pageIndex === maxIndex - 1 ? "JETZT ANFRAGEN" : "WEITER"}
          </Button>
        </>
      )}
    </Flex>
  );
};

export default Pagination;
