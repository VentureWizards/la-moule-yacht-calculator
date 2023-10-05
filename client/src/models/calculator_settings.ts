class CalculatorSettings {
  constructor(
    public occasion?: Occasion,
    public time?: {
      from: Date;
      until: Date;
    },
    public persons?: number,
    public catering?: boolean
  ) {}
}

enum Occasion {
  wedding = "wedding",
  birthday = "birthday",
  companyevent = "companyevent",
  other = "other",
}

export default CalculatorSettings;
