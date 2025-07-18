import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import AuthContextProvider from './context'
import RouteApp from './route'
import './styles/styles.less'



function App() {

 
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <AuthContextProvider>
        <RouteApp />
      </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App
