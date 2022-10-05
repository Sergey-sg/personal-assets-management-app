import RegisterForm from 'components/registerForm/RegisterForm'
import React from 'react'
import LoginForm from '../../components/loginForm/LoginForm'
import SliderLogin from '../../components/slider/SliderLogin/SliderLogin'

const LoginPage = () => {
  const [togglePage, setTogglePage] = React.useState<boolean>(true)

  const toggleFunction: () => void = () => {
    setTogglePage(!togglePage)
  }

  return (
    <div className="grid grid-cols-2 h-max" style={{ height: '100vh' }}>
      <SliderLogin />
      {togglePage ? (
        <LoginForm toggleFunction={toggleFunction} />
      ) : (
        <RegisterForm toggleFunction={toggleFunction} />
      )}
    </div>
  )
}

export default LoginPage
