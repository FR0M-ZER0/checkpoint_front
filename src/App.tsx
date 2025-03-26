import { BrowserRouter, Routes, Route } from 'react-router'

// Páginas
import LoginPage from './pages/Employee/LoginPage'
import MarkingPage from './pages/Employee/MarkingPage'
import DayPage from './pages/Employee/DayPage'
import JustificationPage from './pages/Employee/JustificationPage'
import NotificationsPage from './pages/Employee/NotificationsPage'

// Páginas de admin
import DashboardPage from './pages/Admin/DashboardPage'
import AdminNotificationsPage from './pages/Admin/NotificationsPage'
import MarkingsPage from './pages/Admin/MarkingsPage'

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
			<Routes>
				<Route path="/abono" element={<JustificationPage />} />
			</Routes>
			<Routes>
				<Route path="/notificacoes" element={<NotificationsPage />} />
			</Routes>

			{/* Admin */}
			<Routes>
				<Route path="/admin/dashboard" element={<DashboardPage />} />
			</Routes>
			<Routes>
				<Route path="/admin/solicitações" element={<AdminNotificationsPage />} />
			</Routes>
			<Routes>
				<Route path="/admin/marcações" element={<MarkingsPage />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
