import { BrowserRouter, Routes, Route } from 'react-router'

// Páginas
import LoginPage from './pages/Employee/LoginPage'
import MarkingPage from './pages/Employee/MarkingPage'
import DayPage from './pages/Employee/DayPage'

function App() {
	/**
	 * Rotas
	 */
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
			</Routes>
			<Routes>
				<Route path="/" element={<MarkingPage />} />
			</Routes>
			<Routes>
				<Route path="/dia" element={<DayPage />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
