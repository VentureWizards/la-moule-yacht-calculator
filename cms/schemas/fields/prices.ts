import {defineField} from 'sanity'

const prices = defineField({
  name: 'prices',
  type: 'object',
  fields: [
    {name: 'boatPerHour', type: 'number', title: 'Boot pro Stunde'},
    {name: 'skipperPerHour', type: 'number', title: 'Skipper pro Stunde'},
    {name: 'cateringPerPerson', type: 'number', title: 'Catering pro Person'},
    {name: 'drinksPerPersonPerHour', type: 'number', title: 'Drinks pro Person pro Stunde'},
    {name: 'cleaningFee', type: 'number', title: 'Reinigungs Pauschale'},
  ],
  initialValue: {
    boatPerHour: 400,
    drinksPerPersonPerHour: 10,
    cateringPerPerson: 35,
    cleaningFee: 200,
    skipperPerHour: 40,
  },
})

export default prices
