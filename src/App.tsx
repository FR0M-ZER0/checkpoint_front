import { BrowserRouter, Routes, Route } from 'react-router'
import LoginPage from './pages/Employee/LoginPage'

function App() {
	/**
	 * Rotas
	 */
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LoginPage />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
