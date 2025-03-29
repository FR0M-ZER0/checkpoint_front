import { BrowserRouter, Routes, Route } from 'react-router'

// Páginas
import LoginPage from './pages/Employee/LoginPage'
import LoginPageAdmin from './pages/Admin/LoginPageAdmin'
import MarkingPage from './pages/Employee/MarkingPage'
import DayPage from './pages/Employee/DayPage'
import JustificationPage from './pages/Employee/JustificationPage'
import NotificationsPage from './pages/Employee/NotificationsPage'
import Ferias from './pages/Ferias/Ferias'

// Páginas de admin
import DashboardPage from './pages/Admin/DashboardPage'
import AdminNotificationsPage from './pages/Admin/NotificationsPage'
import MarkingsPage from './pages/Admin/MarkingsPage'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/" element={<MarkingPage />} />
				<Route path="/dia" element={<DayPage />} />
				<Route path="/ferias" element={<Ferias />} />
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
				<Route path="/admin/login" element={<LoginPageAdmin/>} />
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