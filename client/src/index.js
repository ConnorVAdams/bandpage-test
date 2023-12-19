import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import App from './App';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react';
import { store } from './app/store';

const container = document.getElementById('root');
const root = createRoot(container);

let persistor = persistStore(store)

root.render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <Router>
                <App />
            </Router>
        </PersistGate>
    </Provider>
    );