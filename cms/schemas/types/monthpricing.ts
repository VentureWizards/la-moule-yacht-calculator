import {createSchema, defineType} from 'sanity'
import weekday from '../fields/weekday'
import month, {months} from '../fields/month'
const weekdays = {
  monday: 'Montag',
  tuesday: 'Dienstag',
  wednesday: 'Mittwoch',
  thursday: 'Donnerstag',
  friday: 'Freitag',
  saturday: 'Samstag',
  sunday: 'Sonntag',
}

const monthpricing = defineType({
  title: 'Month Pricing',
  name: 'monthpricing',
  type: 'document',
  fields: [month, ...Object.entries(weekdays).map(([key, value]) => weekday(key, value))],
  preview: {
    select: {
      month: 'month',
    },

    prepare(selection) {
      const {month} = selection

      return {
        //@ts-ignore
        title: months[month],
      }
    },
  },
})

export default monthpricing
