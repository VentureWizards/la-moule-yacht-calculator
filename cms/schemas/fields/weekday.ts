import {defineField, defineType} from 'sanity'
import prices from './prices'

const weekday = (name: string, title: string) =>
  defineField({
    type: 'object',
    name,
    title,
    fields: [prices],
    preview: {
      select: {
        title,
        subtitle: 'Wochentag',
      },
    },
  })

export default weekday
