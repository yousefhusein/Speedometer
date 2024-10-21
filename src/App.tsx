import './App.css'

import '@fontsource/squada-one'
import Header from './components/Header'
import Router from './Router'
import { Provider } from './contexts/dataList'

function App() {
    return (
        <Provider>
            <Header />
            <Router />
        </Provider>
    )
}

export default App
