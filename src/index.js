import querystring from 'querystring'
import 'isomorphic-fetch' // eslint-disable-line import/no-unassigned-import
import { required, checkStatus, parseJSON } from './helpers'

function SyncanoClient(instanceName = required('instanceName'), options = {}) {
  client.instanceName = instanceName
  client.baseUrl = options.baseUrl || `https://${instanceName}.syncano.space/`
  client.loginMethod = options.loginMethod
  client.token = options.token

  let defaults = {
    'Content-Type': 'application/json'
  }

  if (client.token) {
    defaults = Object.assign({
      'X-API-KEY': client.token
    }, defaults)
  }

  client.headers = headers => Object.assign(defaults, headers)

  return client
}

function client(endpoint = required('endpoint'), body = {}, options = {}) {
  return fetch(this.url(endpoint), {
    method: 'POST',
    headers: this.headers(options.headers),
    body,
    ...options
  })
    .then(checkStatus)
    .then(parseJSON)
}

client.post = client

client.login = function (username, password) {
  const login = this.loginMethod ? this.loginMethod : (username, password) => {
    const authUrl = `${this.baseUrl}${this.instanceName}/user/auth/`
    const body = JSON.stringify({ username, password })
    const options = {
      headers: {
        'Content-Type': 'application/json'
      },
      body
    }

    return fetch(authUrl, options)
      .then(user => {
        this.setToken(user.token)

        return user
      })
  }

  return login(username, password)
}

client.url = function (endpoint, query) {
  const url = `${this.baseUrl}${endpoint}/`

  query = querystring.stringify(query)

  return query ? `${url}${query}` : url
}

client.logout = function () {
  this.token = undefined
}

client.setToken = function (token) {
  this.token = token
}

client.get = function (endpoint = required('endpoint'), body = {}, options = {}) {
  return fetch(this.url(endpoint, body), {
    method: 'GET',
    headers: this.headers(options.headers),
    ...options
  })
    .then(checkStatus)
    .then(parseJSON)
}

client.delete = function (endpoint = required('endpoint'), body = {}, options = {}) {
  return fetch(this.url(endpoint), {
    method: 'DELETE',
    headers: this.headers(options.headers),
    body,
    ...options
  })
    .then(checkStatus)
    .then(parseJSON)
}

client.put = function (endpoint = required('endpoint'), body = {}, options = {}) {
  return fetch(this.url(endpoint), {
    method: 'PUT',
    headers: this.headers(options.headers),
    body,
    ...options
  })
    .then(checkStatus)
    .then(parseJSON)
}

client.patch = function (endpoint = required('endpoint'), body = {}, options = {}) {
  return fetch(this.url(endpoint), {
    method: 'PATCH',
    headers: this.headers(options.headers),
    body,
    ...options
  })
    .then(checkStatus)
    .then(parseJSON)
}

export default SyncanoClient
