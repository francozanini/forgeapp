import {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {RootRoute, Route, Router, RouterProvider} from '@tanstack/router'
import Sheet from './routes/Sheet.tsx'

const sheetRoute = new RootRoute({
  component: Sheet,
})

function AbilitiesSavesSenses() {
  return <div></div>
}

const abilitiesSavesSensesRoute = new Route({
  component: AbilitiesSavesSenses,
  getParentRoute: () => sheetRoute,
  path: '/abilities',
})

const routeTree = sheetRoute.addChildren([abilitiesSavesSensesRoute])

const router = new Router({routeTree})

declare module '@tanstack/router' {
  interface Register {
    router: typeof router
  }
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}
