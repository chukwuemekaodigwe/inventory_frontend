import { useConfigStore } from "~~/store/config"

//const nuxtApp = useNuxtApp()



export default defineNuxtRouteMiddleware((to, from) => {
  const configStore = useConfigStore()
//console.log(!configStore.user)

  if (!configStore.user || !configStore.auth_token) {
    configStore.alert_msg = 'Please you need to login to accesss the page'
    return navigateTo('/login')
  }

  
  // if (to.path == 'login' && configStore.auth_token) {
  //   return navigateTo('/')
  // }
  
})



/**
 * 
 * SAVE THE PAGE WITH .global.ts
 * 
 * There are three kinds of route middleware:
Anonymous (or inline) route middleware, which are defined directly in the pages where they are used.
Named route middleware, which are placed in the middleware/ directory and will be automatically loaded via asynchronous import when used on a page. (Note: The route middleware name is normalized to kebab-case, so someMiddleware becomes some-middleware.)
Global route middleware, which are placed in the middleware/ directory (with a .global suffix) and will be automatically run on every route change.
The first two kinds of route middleware can be defined in definePageMeta.
Format
Route middleware are navigation guards that receive the current route and the next route as arguments.
export default defineNuxtRouteMiddleware((to, from) => {
if (to.params.id === '1') {
  return abortNavigation()
}
// In a real app you would probably not redirect every route to `/`
// however it is important to check `to.path` before redirecting or you
// might get an infinite redirect loop
if (to.path !== '/') {
  return navigateTo('/')
}
})
Copy to clipboard
Nuxt provides two globally available helpers that can be returned directly from the middleware:
navigateTo (to: RouteLocationRaw | undefined | null, options?: { replace: boolean, redirectCode: number, external: boolean ) - Redirects to the given route, within plugins or middleware. It can also be called directly to perform page navigation.
abortNavigation (err?: string | Error) - Aborts the navigation, with an optional error message.
Unlike navigation guards in the vue-router docs, a third next() argument is not passed, and redirects or route cancellation is handled by returning a value from the middleware. Possible return values are:
nothing - does not block navigation and will move to the next middleware function, if any, or complete the route navigation
return navigateTo('/') or return navigateTo({ path: '/' }) - redirects to the given path and will set the redirect code to 302 Found if the redirect happens on the server side
return navigateTo('/', { redirectCode: 301 }) - redirects to the given path and will set the redirect code to 301 Moved Permanently if the redirect happens on the server side
👉
Read more in Docs > API > Utils > Navigate To.
return abortNavigation() - stops the current navigation
return abortNavigation(error) - rejects the current navigation with an error

 */