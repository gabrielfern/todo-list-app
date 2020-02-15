import React from 'react'
import Login from './lib/Login'
import Register from './lib/Register'
import Tasks from './lib/Tasks'
import CreateTask from './lib/CreateTask'
import AsyncStorage from '@react-native-community/async-storage'

const App = () => {
  const changeCurrentScreen = (newScreen) => {
    setCurrentScreen(
      React.createElement(screens[newScreen].component, screens[newScreen].props())
    )
  }
  const [token, setToken] = React.useState('')

  AsyncStorage.getItem('token').then(value => {
    if (value) {
      setToken(value)
    }
  })

  const screens = {
    login: {
      component: Login,
      props: () => ({ changeCurrentScreen, setToken })
    },
    register: {
      component: Register,
      props: () => ({ changeCurrentScreen })
    },
    tasks: {
      component: Tasks,
      props: () => ({ changeCurrentScreen, token })
    },
    createTask: {
      component: CreateTask,
      props: () => ({ changeCurrentScreen, token })
    }
  }

  const [currentScreen, setCurrentScreen] = React.useState(
    React.createElement(screens.login.component, screens.login.props())
  )

  React.useEffect(() => {
    if (token) {
      changeCurrentScreen('tasks')
    }
  }, [token])

  return (
    <>
      {currentScreen}
    </>
  )
}

export default App
