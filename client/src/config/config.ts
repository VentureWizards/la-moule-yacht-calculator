const initialFrom = new Date();
const initialUntil = new Date();

initialFrom.setHours(12);
initialUntil.setHours(16);

const config = {
  sizes: {
    contentMaxWidth: "1000px",
    // sliderWidth: { base: "300px", sm: "350px", lg: "450px" },
    sliderWidth: "450px",
    sliderHeight: "350px",
  },
  colors: {
    primary: "#EEC570",
    background: "#F7F4EF",
    surface: "#ECE6DB",
  },
  prices: {
    boatPerHour: 400,
    drinksPerPersonPerHour: 10,
    cateringPerPerson: 35,
    cleaningFee: 200,
    skipperPerHour: 40,
  },
  defaults: {
    time: {
      from: initialFrom,
      until: initialUntil,
    },
  },
};

export default config;
