import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, concat, ApolloProvider } from '@apollo/client';
import store from './store.ts';
import { BrowserRouter as Router } from 'react-router-dom';

const httpLink = new HttpLink({ uri: import.meta.env.VITE_DB_URI }); // supabase http link

// create middleware
const authMiddleware = new ApolloLink((operation, forward) => {
  const token = import.meta.env.VITE_TOKEN; 
  operation.setContext({
    headers: {
      'apikey': token,
      Authorization: `Bearer ${token}`,
    },
  });

  return forward(operation);
});

// create apollo client
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <ApolloProvider client={client}>
        <Router>
          <App />
        </Router>
      </ApolloProvider>
    </Provider>
  ,
)
