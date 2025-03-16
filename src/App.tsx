import { BrowserRouter, Routes, Route } from 'react-router'

// Páginas
import LoginPage from './pages/Employee/LoginPage'
import MarkingPage from './pages/Employee/MarkingPage'
import DayPage from './pages/Employee/DayPage'
import Ferias from './pages/Ferias/Ferias'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/" element={<MarkingPage />} />
				<Route path="/dia" element={<DayPage />} />
				<Route path="/ferias" element={<Ferias />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App