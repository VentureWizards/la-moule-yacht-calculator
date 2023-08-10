import { create, State, StateCreator, StoreMutatorIdentifier } from "zustand";
import appConfig from "../config/config";

import emailjs from "@emailjs/browser";

export enum Occasion {
  wedding = "wedding",
  birthday = "birthday",
  companyevent = "companyevent",
  jga = "jga",
  babyshower = "babyshower",
  other = "other",
}

function getButtonTextFromOccasion(occasion: Occasion): string {
  switch (occasion) {
    case Occasion.wedding:
      return "Hochzeit";
    case Occasion.birthday:
      return "Geburtstag";
    case Occasion.companyevent:
      return "Firmenevent";
    case Occasion.jga:
      return "JGA";
    case Occasion.babyshower:
      return "Baby Shower";
    case Occasion.other:
      return "Andere";
  }
}

interface CalculatorSettings {
  occasion?: Occasion;
  date?: Date;
  time?: {
    from: Date;
    until: Date;
  };
  persons?: number;
  catering?: boolean;
}

interface FormValues {
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface Prices {
  total: number;
  rent: number;
  drinks: number;
  catering: number;
  cleaning: number;
}

interface CalculatorState {
  prices: Prices;
  formValues: FormValues;
  settings: CalculatorSettings;
  pageIndex: number;
  allowedIndex: number;
  maxIndex: number;
  nextPage: VoidFunction;
  previousPage: VoidFunction;
  canSubmit: boolean;
  setCanSubmit: (value: boolean) => void;
  submitForm: () => Promise<void>;
  isSubmitting: boolean;
  setSettings: (settings: CalculatorSettings) => void;
  setPrices: (prices: Partial<Prices>) => void;
  setFormValues: (values: FormValues) => void;
  setAllowedIndex: (index: number) => void;
}

type MiddlewareImpl = (
  f: StateCreator<CalculatorState, [], []>
) => StateCreator<CalculatorState, [], []>;

const middleware: MiddlewareImpl = (config) => (set, get, api) =>
  config(
    (a) => {
      set(a);

      var allowedIndex = get().maxIndex;
      const settings = get().settings;

      switch (true) {
        case settings.occasion === undefined:
          allowedIndex = 0;
          break;
        case settings.date === undefined || settings.time === undefined:
          allowedIndex = 1;
          break;
        case settings.persons === undefined:
          allowedIndex = 2;
          break;
        case settings.catering === undefined:
          allowedIndex = 3;
      }

      var hours =
        (settings.time?.until.getHours() ?? 0) -
        (settings.time?.from.getHours() ?? 0);

      var prices: any = {
        rent: hours * appConfig.prices.boatPerHour,
        drinks:
          hours *
          (settings.persons ?? 0) *
          appConfig.prices.drinksPerPersonPerHour,
        catering: settings.catering
          ? hours *
            (settings.persons ?? 0) *
            appConfig.prices.cateringPerPersonPerHour
          : 0,
        cleaning: appConfig.prices.cleaningFee,
      };

      prices.total =
        prices.rent + prices.drinks + prices.catering + prices.cleaning;

      api.setState({ allowedIndex, prices });
    },
    get,
    api
  );

const useCalculatorStore = create<CalculatorState>(
  middleware((set, get) => ({
    formValues: {
      email: "",
      name: "",
      company: "",
      phone: "",
    },
    setFormValues: (values: FormValues) => set({ formValues: values }),
    settings: {
      persons: 10,
      catering: false,
      time: {
        from: appConfig.defaults.time.from,
        until: appConfig.defaults.time.until,
      },
    },
    prices: {
      total: 0,
      rent: 0,
      drinks: 0,
      catering: 0,
      cleaning: appConfig.prices.cleaningFee,
    },

    pageIndex: 0,
    allowedIndex: 0,
    maxIndex: 5,
    nextPage: () =>
      set((state) => {
        if (state.pageIndex === state.maxIndex) {
          return {};
        }

        return {
          pageIndex: state.pageIndex + 1,
        };
      }),
    previousPage: () =>
      set((state) => {
        if (state.pageIndex <= 0) {
          return {};
        }

        return {
          pageIndex: state.pageIndex - 1,
        };
      }),
    setAllowedIndex: (index) =>
      set({
        allowedIndex: index,
      }),
    setSettings: (newSettings) =>
      set((state) => {
        return {
          settings: {
            ...state.settings,
            ...newSettings,
          },
        };
      }),
    setPrices: (newPrices) =>
      set((state) => {
        return {
          prices: {
            ...state.prices,
            ...newPrices,
          },
        };
      }),
    canSubmit: false,
    isSubmitting: false,
    setCanSubmit: (value) => set({ canSubmit: value }),
    submitForm: async () => {
      set({ isSubmitting: true });

      const state = get();
      const settings = state.settings;
      const prices = state.prices;
      const formValues = state.formValues;

      await emailjs.send(
        "service_rjx2pkc",
        "template_e4gfhgb",
        {
          occasion: settings.occasion
            ? getButtonTextFromOccasion(settings.occasion!)
            : undefined,
          on_date: Intl.DateTimeFormat("de-DE", {
            dateStyle: "long",
          }).format(settings.date),
          from_time: settings.time?.from.getHours(),
          until_time: settings.time?.until.getHours(),
          persons: settings.persons,
          catering: settings.catering ? "Ja" : "Nein",
          price_rent: prices.rent,
          price_drinks: prices.drinks,
          price_catering: prices.catering,
          price_cleaning: prices.cleaning,
          price_total: prices.total,
          sender_name: formValues.name,
          sender_email: formValues.email,
          sender_phone: formValues.phone,
          sender_company: formValues.company,
        },
        "QHeeMOE59AvGtveix"
      );

      set({ isSubmitting: false });
    },
  }))
);

export { useCalculatorStore, getButtonTextFromOccasion };
