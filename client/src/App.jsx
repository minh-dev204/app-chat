import './App.css'
import { Routes, Route, Navigate } from "react-router-dom"
import Chat from './pages/Chat'
import Login from './pages/Login'
import Register from './pages/Register'

// import bootrap react
import "bootstrap/dist/css/bootstrap.min.css"
import { Container } from "react-bootstrap"
import NavBar from './components/NavBar'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import { ChatContextProvider } from './context/ChatContext'

function App() {
  const { user } = useContext(AuthContext)
  // seeting router
  return (
    <>
      <ChatContextProvider user={user}>
        <NavBar />
        <Container >
          <Routes>
            {/* mấy cái kiểu user ? : là mình set như thế để bảo vệ router, đăng nhập thành công thì khỏi vào login hay register */}
            <Route path='/' element={user ? <Chat /> : <Login />} />
            <Route path='/login' element={user ? <Chat /> : <Login />} />
            <Route path='/register' element={user ? <Chat /> : <Register />} />
            <Route path='*' element={<Navigate to="/" />} />
            {/* có thể nếu có đường dẫn khác thì nó sẽ về lại path= "/" */}
          </Routes>
        </Container>
      </ChatContextProvider>
    </>
  )
}


// className = 'text-secondary'
export default App
