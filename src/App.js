import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import awsConfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

Auth.configure(awsConfig);
API.configure(awsConfig);

function updateTodo(todo, newDesc) {
  todo['description'] = newDesc;
  API.graphql(graphqlOperation(mutations.updateTodo, {input:todo}));
}

function deleteTodo(todo) {
  API.graphql(graphqlOperation(mutations.deleteTodo, {input:{'id':todo['id']}}));
}

function App() {

  const userTodos = API.graphql(graphqlOperation(queries.listTodos, {filter:{'name':{'eq':"ocben1"}}}));
  console.log(userTodos);

  const allTodos = API.graphql(graphqlOperation(queries.listTodos));
  console.log(allTodos);

  const oneTodo = API.graphql(graphqlOperation(queries.getTodo, {id: "d3749075-7aa4-4ef6-95ab-857b09616ab3"}))
  .then(function(todo) {
    // updateTodo(todo['data']['getTodo'], "new desc");
    // deleteTodo(todo['data']['getTodo']);
  });
  console.log(oneTodo);

  Auth.currentAuthenticatedUser({
    bypassCache: false
  }).then(function(user) {
    console.log("User: " + JSON.stringify(user));
    const todo = {name: user['username'], description: "new todo"};
    const newTodo = API.graphql(graphqlOperation(mutations.createTodo, {input: todo}));
  }).catch(err => console.log(err));

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload. Ok! I get it!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default withAuthenticator(App, {includeGreetings: true});
