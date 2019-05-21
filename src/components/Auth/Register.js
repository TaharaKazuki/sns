import React, { Component } from 'react'
import firebase from '../../components/firebase'
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class Register extends Component {

  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false
  }

  isFormValid = () => {
    let errors = []
    let error

    if (this.isFormEmpty(this.state)) {
      error = { message: 'Fill in all fields'}
      this.setState({ errors: errors.concat(error)})
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: 'Password is isvalid'}
      this.setState({ errors: errors.concat(error)})
    } else {
      return true
    }
  }

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return !username.length || !email.length || !password.length || !passwordConfirmation.length
  }

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false
    }
    if (password !== passwordConfirmation) {
      return false
    }
    return true
  }

  displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true })
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createUser => {
          console.info(createUser)
          this.setState({ loading: false })
        })
        .catch(err => {
          console.info(err)
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          })
        })
    }
  }

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? 'error'
      : ''
  }

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading
    } = this.state



    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450}}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
              Register for DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                value={username}
                onChange={this.handleChange} type="text"/>

              <Form.Input
                fluid name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                value={email}
                className={this.handleInputError(errors, 'email')}
                onChange={this.handleChange} type="email"/>

              <Form.Input
                fluid name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                value={password}
                className={this.handleInputError(errors, 'password')}
                onChange={this.handleChange} type="password"/>

              <Form.Input
                fluid name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                value={passwordConfirmation}
                className={this.handleInputError(errors, 'password')}
                onChange={this.handleChange} type="password"/>

              <Button
                disabled={loading}
                className={loading ? 'loading': ''}
                color="orange" fluid size="large">Submit</Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Already a user ?<Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}
