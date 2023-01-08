import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';


function App() {

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <Outlet />
      </Container>
    </>
  );
}

export default observer(App);
