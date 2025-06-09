import { BrowserRouter } from 'react-router-dom'
import './styles/styles.less'
import RouteApp from './route'
import { ToastContainer } from 'react-toastify'

function App() {

  return (
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
          <RouteApp />
      </BrowserRouter>
  ) 
}

export default App
