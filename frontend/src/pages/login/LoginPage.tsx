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
    <div className="grid grid-cols-2 h-full">
      <div className="flex items-center justify-center bg-green-light">
        <div className="w-full">
          <SliderLogin />
        </div>
      </div>
      <div style={{ margin: 'auto', width: '100%' }}>
        <Layout>
          <Outlet />
        </Layout>
      </div>
    </div>
  )
}

export default LoginPage
