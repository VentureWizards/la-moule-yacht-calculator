import {defineField} from 'sanity'

export const months = {
  january: 'Januar',
  february: 'Februar',
  march: 'März',
  april: 'April',
  may: 'Mai',
  june: 'Juni',
  july: 'Juli',
  august: 'August',
  september: 'September',
  october: 'Oktober',
  november: 'November',
  december: 'December',
}

const month = defineField({
  name: 'month',
  title: 'Month',
  type: 'string',
  options: {
    list: Object.entries(months).map(([key, value]) => ({title: value, value: key})),
    layout: 'dropdown',
  },
})

export default month
