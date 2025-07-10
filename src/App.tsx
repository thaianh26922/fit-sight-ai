import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import './styles/styles.less'
import RouteApp from './route'
import { ToastContainer } from 'react-toastify'
import AuthContextProvider from './context'
import usersData from './database.json'

function App() {

  useEffect(() => {
    const existingUsers = localStorage.getItem('users')
    if (!existingUsers) {
      localStorage.setItem('users', JSON.stringify(usersData))
    }
  }, [])

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
