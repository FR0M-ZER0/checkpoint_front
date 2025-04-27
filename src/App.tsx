import { BrowserRouter, Routes, Route } from 'react-router';

// Páginas de colaborador
import LoginPage from './pages/Employee/LoginPage';
import MarkingPage from './pages/Employee/MarkingPage';
import DayPage from './pages/Employee/DayPage';
import JustificationPage from './pages/Employee/JustificationPage';
import NotificationsPage from './pages/Employee/NotificationsPage';
import Ferias from './pages/Ferias/Ferias';
import FolgaPage from './pages/Folga/FolgaPage';
import EspelhoPontoPage from './pages/Employee/EspelhoPontoPage';

// Páginas de admin
import DashboardPage from './pages/Admin/DashboardPage'
import AdminNotificationsPage from './pages/Admin/SolicitationsPage'
import MarkingsPage from './pages/Admin/MarkingsPage'
import LoginPageAdmin from './pages/Admin/LoginPageAdmin'
import DashboardLayout from './pages/Admin/Layout'
import DashboardPageV2 from './pages/Admin/Dashboard';
import SolicitacoesPage from './pages/Admin/SolicitacoesPage';
import ColaboradoresPage from './pages/Admin/ColaboradoresPage';
import MarcacoesPage from './pages/Admin/MarcacoesPage';
import RelatoriosPage from './pages/Admin/RelatoriosPage';


function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/" element={<MarkingPage />} />
				<Route path="/dia/:date" element={<DayPage />} />
				<Route path="/ferias" element={<Ferias />} />
				<Route path="/folgas" element={<FolgaPage />} />
				<Route path="/abono" element={<JustificationPage />} />
				<Route path="/notificacoes" element={<NotificationsPage />} />
				<Route path="/espelho-ponto" element={<EspelhoPontoPage />} />

				{/* Admin */}
				{/* <Route path="/admin/dashboard" element={<DashboardPage />} /> */}
				<Route path="/admin/dashboard" element={
					<DashboardLayout> 
						<DashboardPageV2 /> 
					</DashboardLayout>}
				/>
				<Route path="/admin/solicitacoes" element={
					<DashboardLayout> 
						<SolicitacoesPage /> 
					</DashboardLayout>}
				/>
				<Route path="/admin/colaboradores" element={
					<DashboardLayout> 
						<ColaboradoresPage /> 
					</DashboardLayout>}
				/>
				<Route path="/admin/marcacoes" element={
					<DashboardLayout> 
						<MarcacoesPage /> 
					</DashboardLayout>}
				/>
				<Route path="/admin/relatorios" element={
					<DashboardLayout> 
						<RelatoriosPage /> 
					</DashboardLayout>}
				/>
				<Route path="/admin/login" element={<LoginPageAdmin/>} />
				{/* <Route path="/admin/solicitações" element={<AdminNotificationsPage />} />
				<Route path="/admin/marcações" element={<MarkingsPage />} /> */}
			</Routes>
		</BrowserRouter>
	)
}

export default App;