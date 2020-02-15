/* global fetch */
import React from 'react'
import {
  Text,
  TextInput,
  ScrollView,
  Button,
  View,
  Picker
} from 'react-native'
import { apiURL } from '../app.json'

const CreateTask = (props) => {
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [status, setStatus] = React.useState('TODO')

  const [msgError, setMsgError] = React.useState('')

  const create = () => {
    const data = { title, description, status }

    fetch(apiURL + '/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Token: props.token
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (res.status === 200) {
          setTitle('')
          setDescription('')
          setMsgError('')
        } else if (res.status === 401) {
          setMsgError('Authentication error (please, login again)')
        } else {
          setMsgError(
            'Error to create task (title must be at least 2 characters long)'
          )
        }
      })
      .catch(() => setMsgError('Unable to communicate with the server'))
  }

  return (
    <>
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps='handled'>
        <Text style={styles.headerText}>Create a new task</Text>

        <Text style={styles.text}>Title</Text>
        <TextInput
          style={styles.inputText} onChangeText={(text) => setTitle(text)}
          value={title}
        />

        <Text style={styles.text}>Description</Text>
        <TextInput
          style={styles.inputText} multiline onChangeText={(text) => setDescription(text)}
          value={description}
        />

        <Picker style={{ margin: 10 }} selectedValue={status} onValueChange={value => setStatus(value)}>
          <Picker.Item label='To do' value='TODO' />
          <Picker.Item label='Doing' value='DOING' />
          <Picker.Item label='Done' value='DONE' />
        </Picker>

        {msgError.length > 0 && <Text style={styles.textError}>{msgError}</Text>}

        <View style={styles.view1}>
          <View style={styles.view2}>
            <Button title='Create' onPress={create} />
          </View>
          <View style={styles.view2}>
            <Button title='Go Back' onPress={() => props.changeCurrentScreen('tasks')} color='gray' />
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

export default CreateTask
