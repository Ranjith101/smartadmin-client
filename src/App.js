import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import UserForm from './components/UserForm';
import ConfigurableList from './components/UserList';
import UserView from './components/UserView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/create" element={<UserForm />} />
        <Route path="/users" element={<ConfigurableList tableName="user" />} />
        <Route path="/edit-user/:id" element={<UserForm />} />
        <Route path="/view-user/:id" element={<UserForm />} />
      </Routes>
    </Router>
  );
}

export default App;
