import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VDataTable, VDataTableServer } from 'vuetify/labs/VDataTable'



const customDarkTheme = {
  dark: true,
  colors: {
    background: "#15202b",
    surface: "#15202b",
    primary: "#3f51b5",
    secondary: "#03dac6",
    error: "#ff5722",
  },
};

const customLightTheme = {
  dark: false,
  colors: {
    //background: "#ccc",
    //surface: "#fff",
    primary: "#3f51b5",
    secondary: "#00ccff",
    error: "#ffcc00",
  },
};



export default defineNuxtPlugin((nuxt) => {
  
  const vuetify = createVuetify({
    ssr: true,
    theme: {
      variations: {
        colors: ['primary', 'secondary', 'tertiary'],
        lighten: 2,
        darken: 2,
      },
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#3f2380',
            secondary: '#1a113c',
            "on-secondary": '#fff',
            tertiary: '#593a88',
            background: '#eee',
            
          },
          

        },
        dark: {
          dark: true,
          colors: {
            primary: '#1e1a56',
            secondary: '0e0d12',
            tertiary: '#EA80FC'
          }
        }
      }
    },
    directives,
    components: {
      ...components,
      VDataTable,
      VDataTableServer,
    },
    defaults: {
      VDataTable: {
        fixedHeader: true,
        noDataText: 'Results not found',
      },
    },

  });
  nuxt.vueApp.use(vuetify)
})