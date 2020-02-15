/* global fetch */
import React from 'react'
import {
  Text,
  TextInput,
  ScrollView,
  Button,
  View,
  Modal,
  Picker
} from 'react-native'
import { apiURL } from '../app.json'
import AsyncStorage from '@react-native-community/async-storage'

const Tasks = (props) => {
  const [tasks, setTasks] = React.useState([])

  const [taskIndex, setTaskIndex] = React.useState(0)
  const [taskId, setTaskId] = React.useState('')
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [status, setStatus] = React.useState('TODO')

  const [modalVisible, setModalVisible] = React.useState(false)

  const [msgError, setMsgError] = React.useState('')

  React.useEffect(() => {
    fetch(apiURL + '/tasks', {
      headers: {
        'Content-type': 'application/json',
        Token: props.token
      }
    })
      .then(res => res.json())
      .then(data => {
        for (const i in data) {
          data[i].index = i
        }
        setTasks(data)
      })
      .catch(console.log)
  }, [])

  const updateTask = () => {
    const data = { title, description, status }

    fetch(apiURL + '/tasks/' + taskId, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Token: props.token
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (res.status === 200) {
          const newTasks = tasks.slice()
          newTasks[taskIndex].title = title
          newTasks[taskIndex].description = description
          newTasks[taskIndex].status = status
          setTasks(newTasks)
          setMsgError('')
          setModalVisible(false)
        } else if (res.status === 401) {
          setMsgError('Authentication error (please, login again)')
        } else {
          setMsgError(
            'Error to edit task (title must be at least 2 characters long)'
          )
        }
      })
      .catch(() => setMsgError('Unable to communicate with the server'))
  }

  const remove = () => {
    fetch(apiURL + '/tasks/' + taskId, {
      method: 'DELETE',
      headers: {
        Token: props.token
      }
    })
      .then(res => {
        if (res.status === 200) {
          const newTasks = tasks.filter((task, ind) => {
            return task.index !== taskIndex
          })
          setTasks(newTasks)
          setMsgError('')
          setModalVisible(false)
        } else {
          setMsgError('Authentication error (please, login again)')
        }
      })
      .catch(() => setMsgError('Unable to communicate with the server'))
  }

  const logout = () => {
    AsyncStorage.removeItem('token').then(() => {
      props.changeCurrentScreen('login')
    })
  }

  return (
    <>
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps='handled'>
        <Text style={styles.headerText}>To Do list</Text>

        <View style={styles.view1}>
          <View style={styles.view2}>
            <Button title='Logout' onPress={logout} color='red' />
          </View>
          <View style={styles.view2}>
            <Button title='Create Task' onPress={() => props.changeCurrentScreen('createTask')} />
          </View>
        </View>

        <Modal
          animationType='none'
          visible={modalVisible} style={{ height: 200 }}
        >
          <ScrollView style={styles.scrollView} keyboardShouldPersistTaps='handled'>
            <Text style={styles.headerText}>Edit task</Text>

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
                <Button title='Delete' onPress={remove} color='red' />
              </View>
              <View style={styles.view2}>
                <Button title='Confirm' onPress={updateTask} />
              </View>
              <View style={styles.view2}>
                <Button
                  title='Cancel' onPress={() => {
                    setMsgError('')
                    setModalVisible(false)
                  }} color='gray'
                />
              </View>
            </View>
          </ScrollView>
        </Modal>

        <View style={{ padding: 15 }}>
          <Text style={styles.text}>To do</Text>
          {tasks.filter(task => task.status === 'TODO').map(task => {
            return (
              <View key={task.id} style={{ padding: 5, height: 50, flexDirection: 'row' }}>
                <Text style={styles.taskTitle} selectable>{task.title}</Text>
                <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                  <Button
                    title='Edit' onPress={() => {
                      setTaskIndex(task.index)
                      setTaskId(task.id)
                      setTitle(task.title)
                      setDescription(task.description)
                      setStatus(task.status)
                      setModalVisible(true)
                    }} color='gray'
                  />
                </View>
              </View>
            )
          })}
        </View>

        <View style={{ padding: 15 }}>
          <Text style={styles.text}>Doing</Text>
          {tasks.filter(task => task.status === 'DOING').map(task => {
            return (
              <View key={task.id} style={{ padding: 5, height: 50, flexDirection: 'row' }}>
                <Text style={styles.taskTitle} selectable>{task.title}</Text>
                <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                  <Button
                    title='Edit' onPress={() => {
                      setTaskIndex(task.index)
                      setTaskId(task.id)
                      setTitle(task.title)
                      setDescription(task.description)
                      setStatus(task.status)
                      setModalVisible(true)
                    }} color='gray'
                  />
                </View>
              </View>
            )
          })}
        </View>

        <View style={{ padding: 15 }}>
          <Text style={styles.text}>Done</Text>
          {tasks.filter(task => task.status === 'DONE').map(task => {
            return (
              <View key={task.id} style={{ padding: 5, height: 50, flexDirection: 'row' }}>
                <Text style={styles.taskTitle} selectable>{task.title}</Text>
                <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                  <Button
                    title='Edit' onPress={() => {
                      setTaskIndex(task.index)
                      setTaskId(task.id)
                      setTitle(task.title)
                      setDescription(task.description)
                      setStatus(task.status)
                      setModalVisible(true)
                    }} color='gray'
                  />
                </View>
              </View>
            )
          })}
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
  taskTitle: {
    fontSize: 15
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
    flexDirection: 'row'
  },
  view2: {
    padding: 15,
    flex: 1
  }
}

export default Tasks
