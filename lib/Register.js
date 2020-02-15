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

const Register = (props) => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [password2, setPassword2] = React.useState('')

  const [msgError, setMsgError] = React.useState('')

  const register = () => {
    const data = { username, password }
    if (password !== password2) setMsgError('Passwords don\'t match')
    else {
      fetch(apiURL + '/users', {
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
            setPassword2('')
            setMsgError('')
          } else if (res.status === 403) {
            setMsgError('User already exists')
          } else {
            setMsgError(
              'Error to create account (username and password must be at least 4 characters long)'
            )
          }
        })
        .catch(() => setMsgError('Unable to communicate with the server'))
    }
  }

  return (
    <>
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps='handled'>
        <Text style={styles.headerText}>Register a new account</Text>

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

        <Text style={styles.text}>Confirm Password</Text>
        <TextInput
          style={styles.inputText} secureTextEntry onChangeText={(text) => setPassword2(text)}
          value={password2}
        />

        {msgError.length > 0 && <Text style={styles.textError}>{msgError}</Text>}

        <View style={styles.view1}>
          <View style={styles.view2}>
            <Button title='Register' onPress={register} />
          </View>
          <View style={styles.view2}>
            <Button title='Login' onPress={() => props.changeCurrentScreen('login')} color='gray' />
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
    color: 'red',
    margin: 5
  },
  view1: {
    margin: 15
  },
  view2: {
    padding: 15
  }
}

export default Register
