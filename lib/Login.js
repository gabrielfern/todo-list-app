/* global fetch */
import React from 'react'
import {
  Text,
  TextInput,
  ScrollView,
  Button,
  View
} from 'react-native'
import { apiURL } from '../app.json'

const Login = (props) => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  const login = () => {
    const data = { username, password }

    fetch(apiURL + '/tokens', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (res.status === 200) {
          setUsername('')
          setPassword('')
        }
        return res.json()
      })
      .then(({ token }) => {
        props.setToken(token)
      })
      .catch(console.log)
  }

  return (
    <>
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps='handled'>
        <Text style={styles.headerText}>Login to your account</Text>

        <Text style={styles.text}>Username</Text>
        <TextInput
          style={styles.inputText} onChangeText={(text) => setUsername(text)}
          value={username}
        />

        <Text style={styles.text}>Password</Text>
        <TextInput
          style={styles.inputText} secureTextEntry onChangeText={(text) => setPassword(text)}
          value={password}
        />

        <View style={styles.view1}>
          <View style={styles.view2}>
            <Button title='Login' onPress={login} />
          </View>
          <View style={styles.view2}>
            <Button title='Register' onPress={() => props.changeCurrentScreen('register')} color='gray' />
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const styles = {
  scrollView: {
    backgroundColor: 'powderblue'
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 15,
    fontSize: 20
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 15
  },
  inputText: {
    backgroundColor: 'white',
    margin: 15,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10
  },
  textError: {
    textAlign: 'center',
    color: 'red'
  },
  view1: {
    margin: 15
  },
  view2: {
    padding: 15
  }
}

export default Login
