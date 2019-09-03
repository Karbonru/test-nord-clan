import React, {Component} from 'react';
import FormLogin from './components/FormLogin/FormLogin';
import './App.css';
import { Layout, Row, Col, Button } from 'antd';
import withFirebaseAuth from 'react-with-firebase-auth'
import firebaseApp from './lib/firebase.js'
import Account from './pages/account/Account.js'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"
import { connect } from 'react-redux';
import * as firebase from 'firebase/app';
const { Header, Content } = Layout;



class App extends Component {
  componentDidMount() {
    
  }
  
  updateData() {
    const user = this.props.user
    this.props.setUser(user)
    return <Account />
  }
  render() {
    const {
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      signOut,
      setError,
      user,
      error,
    } = this.props;
    let userBlock
    if (user) {
      userBlock = <div className="headerAppActions">
        <div>Баланс: {this.props.balance} руб.</div>
        <Button
          type="primary"
          onClick={() => signOut()}
          size="small"
          style={{ width: 90, marginLeft: 15 }}
        >Выход</Button>
      </div>
      
    }
    return (
      <Layout className="layout">
      <Header className="headerApp">
        <h1>Test NordClan</h1>
        {userBlock}
      </Header>
      <Row className="contentWrap">
        <Col span={!user ? 8 : 24} offset = {!user ? 8 : 0}>
          <Content style={{ padding: '0 50px' }}>
            <div className="contentWrap">
              <Router>
                <Route path="/">
                {
                    user ? 
                      <Redirect to="/account" component={Account} />
                    : 
                      <FormLogin 
                        user={user}
                        createUserWithEmailAndPassword={createUserWithEmailAndPassword}
                        signInWithEmailAndPassword={signInWithEmailAndPassword}
                        signOut={signOut}
                        setError={setError}
                        error={error}
                      />
                  }
                </Route>
                <Route path="/account" >
                  { user ? this.updateData() : <Redirect to="/" /> }
                </Route>
              </Router>
            </div>
          </Content>
        </Col>
        </Row>
    </Layout>
    );
  }
}


const firebaseAppAuth = firebaseApp.auth();

const providers = {
  signInWithEmailAndPassword: firebase.auth.signInWithEmailAndPassword,
};

const mapStateToProps = (state, ownProps) => {
  return {
    balance: ownProps.balance = state.default.balance
  }
}


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setUser: (user) => {
      dispatch({type:'SET_USER', user})
    }
  }
}

const appState = withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App)

export default connect(mapStateToProps, mapDispatchToProps)(appState);
