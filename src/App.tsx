import { BrowserRouter } from 'react-router-dom'
import './styles/styles.less'
import RouteApp from './route'

function App() {

  return (
      <BrowserRouter>
          <RouteApp />
      </BrowserRouter>
  ) 
}

export default App
