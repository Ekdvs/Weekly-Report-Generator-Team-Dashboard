import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import { RegisterPage } from './pages/RegisterPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'
import { MyReportsPage } from './pages/MyReportsPage'
import { RoleRoute } from './components/layout/RoleRoute'
import { ProjectsPage } from './pages/ProjectsPage'
import { ReportEditorPage } from './pages/ReportEditorPage'
import { TeamDashboardPage } from './pages/TeamDashboardPage'
import { UserManagementPage } from './pages/UserManagementPage'
import { TeamReportsPage } from './pages/TeamReportsPage'
import { ReportViewPage } from './pages/ReportViewPage'


const RoleHome = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "MANAGER" ? "/dashboard" : "/reports"} replace />;
};

function App() {


  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<RoleHome />} />
              {/* Personal weekly report page — available to everyone */}
              <Route path="/reports" element={<MyReportsPage />} />
              <Route path="/reports/new" element={<ReportEditorPage />} />
              <Route path="/reports/:id" element={<ReportEditorPage />} />

              {/* Manager-only */}
              <Route element={<RoleRoute allow={["MANAGER"]} />}>
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/dashboard" element={<TeamDashboardPage />} />
                <Route path="/users" element={<UserManagementPage />} />
                <Route path="/team-reports" element={<TeamReportsPage />}/>
                <Route path="/team-reports/:id" element={<ReportViewPage />} />

              </Route>

            </Route>

          </Route>

          <Route path="*" element={<NotFoundPage />} />

        </Routes>

      </AuthProvider>

    </BrowserRouter>

  )
}

export default App
