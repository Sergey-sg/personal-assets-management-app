import { Layout } from 'components/common/Layout/Layout'
import React from 'react'
import { Outlet } from 'react-router-dom'
import SliderLogin from '../../components/slider/SliderLogin/SliderLogin'

const LoginPage = () => {
  const [togglePage, setTogglePage] = React.useState<boolean>(true)

  const toggleFunction: () => void = () => {
    setTogglePage(!togglePage)
  }

  return (
    <div className="grid grid-cols-2 h-max" style={{ height: '100vh' }}>
      <SliderLogin />
      <div style={{ margin: 'auto', width: '100%' }}>
        <Layout>
          <Outlet />
        </Layout>
      </div>
    </div>
  )
}

export default LoginPage
