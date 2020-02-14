/* global fetch */
import React from 'react'
import {
  Text
} from 'react-native'
import { apiURL } from '../app.json'

const About = () => {
  const [ip, setIp] = React.useState('retrieving...')

  fetch('https://httpbin.org/ip').then(res => res.json()).then(json => setIp(json.origin))

  return (
    <>
      <Text style={{ textAlign: 'center', fontWeight: 'bold', padding: 15 }}>This is my ip address: {ip}</Text>
      <Text style={{ textAlign: 'center', fontWeight: 'bold', padding: 15 }}>address of api: {apiURL}</Text>
    </>
  )
}

export default About
