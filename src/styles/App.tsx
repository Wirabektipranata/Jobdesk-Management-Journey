// ==================================================
// JOURNEYFX WORKSPACE
// Internal Jobdesk & Project Management System
// Version 1.0.0
// Main Application Layout
// ==================================================

import { useEffect } from 'react';

import {
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
} from 'react-router-dom';

import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  CalendarDays,
  ChevronRight,
  Layers3,
} from 'lucide-react';

import { motion } from 'framer-motion';

// ==================================================
// MANAGEMENT PAGES
// ==================================================

import Dashboard from './pages/Dashboard';
import JobsProject from './pages/JobsProject';
import Report from './pages/Report';

// ==================================================
// APPLICATION CONFIGURATION
// ==================================================

const APP = {
  name: 'JourneyFX Workspace',
  version: '1.0.0',
  subtitle: 'Management System',
  tagline: 'One Team. One Workspace. One Direction.',
};

// ==================================================
// NAVIGATION CONFIGURATION
// ==================================================

const navigation = [
  {
    name: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    description: 'Monitoring & Overview',
  },
  {
    name: 'Jobs & Project',
    path: '/jobs-project',
    icon: ClipboardList,
    description: 'Task & Project Management',
  },
  {
    name: 'Report',
    path: '/report',
    icon: BarChart3,
    description: 'Performance & Evaluation',
  },
];

// ==================================================
// JOURNEYFX BRAND
// ==================================================

function Brand() {
  return (
    <NavLink
      to="/"
      className="flex items-center gap-3"
      aria-label="JourneyFX Workspace Dashboard"
    >
      <div className="
        flex h-11 w-11 shrink-0
        items-center justify-center
        rounded-xl
        border border-workspace-border
        bg-premium-card
        shadow-metallic
      ">
        <span className="
          text-3xl font-black italic text-metallic
        ">
          J.
        </span>
      </div>

      <div className="min-w-0">
        <h1 className="
          text-lg font-bold tracking-tight
          text-workspace-text
        ">
          JourneyFX
        </h1>

        <p className="
          text-2xs uppercase tracking-widest
          text-workspace-muted
        ">
          Workspace
        </p>
      </div>
    </NavLink>
  );
}

// ==================================================
// DESKTOP SIDEBAR
// ==================================================

function Sidebar() {
  return (
    <aside className="
      fixed inset-y-0 left-0 z-sidebar
      hidden w-sidebar flex-col
      border-r border-workspace-border
      bg-workspace-sidebar
      lg:flex
    ">

      <div className="
        border-b border-workspace-border
        px-6 py-6
      ">
        <Brand />
      </div>

      <div className="px-5 pt-8 pb-4">
        <p className="
          text-2xs font-semibold uppercase
          tracking-widest text-workspace-muted
        ">
          Management Workspace
        </p>
      </div>

      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-2 px-4"
      >

        {navigation.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `group flex items-center gap-3
                 rounded-xl border px-4 py-3
                 transition-all duration-200
                 ${
                   isActive
                     ? 'border-workspace-border bg-workspace-elevated text-workspace-text'
                     : 'border-transparent text-workspace-muted hover:bg-workspace-hover hover:text-workspace-text'
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    className={
                      isActive
                        ? 'text-metallic-silver'
                        : 'text-workspace-muted'
                    }
                  />

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-semibold">
                      {item.name}
                    </p>

                    <p className="
                      mt-1 truncate text-2xs
                      text-workspace-muted
                    ">
                      {item.description}
                    </p>

                  </div>

                  {isActive && (
                    <ChevronRight
                      size={15}
                      className="text-workspace-silver"
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}

      </nav>

      {/* Workspace Information */}

      <div className="p-4">

        <div className="
          rounded-card
          border border-workspace-border
          bg-premium-card p-4
        ">

          <div className="flex items-center gap-2">

            <Layers3
              size={18}
              className="text-workspace-silver"
            />

            <p className="text-sm font-semibold">
              Internal Workspace
            </p>

          </div>

          <p className="
            mt-3 text-xs leading-relaxed
            text-workspace-muted
          ">
            {APP.tagline}
          </p>

          <div className="
            mt-4 border-t
            border-workspace-border pt-3
          ">

            <p className="
              text-2xs text-workspace-muted
            ">
              Version {APP.version}
            </p>

          </div>

        </div>

      </div>

      <div className="
        border-t border-workspace-border
        px-6 py-4
      ">
        <p className="
          text-2xs text-workspace-muted
        ">
          © 2026–2027 JourneyFX
        </p>
      </div>

    </aside>
  );
}

// ==================================================
// HEADER COMPONENT
// ==================================================

function Header() {

  const location = useLocation();

  const currentPage =
    navigation.find(
      (item) => item.path === location.pathname
    ) ?? navigation[0];

  const currentDate = new Intl.DateTimeFormat(
    'id-ID',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    }
  ).format(new Date());

  return (
    <header className="
      sticky top-0 z-header
      border-b border-workspace-border
      bg-workspace-sidebar/95
      backdrop-blur-xl
    ">

      <div className="
        flex min-h-header items-center
        justify-between gap-4
        px-4 sm:px-6 lg:px-8
      ">

        {/* Mobile Brand */}

        <div className="lg:hidden">
          <Brand />
        </div>

        {/* Desktop Breadcrumb */}

        <div className="
          hidden items-center gap-3
          lg:flex
        ">

          <span className="
            text-sm text-workspace-muted
          ">
            Workspace
          </span>

          <ChevronRight
            size={15}
            className="text-workspace-muted"
          />

          <span className="
            text-sm font-semibold
            text-workspace-text
          ">
            {currentPage.name}
          </span>

        </div>

        {/* Right Header */}

        <div className="flex items-center gap-4">

          <div className="
            hidden items-center gap-2
            text-xs text-workspace-muted
            md:flex
          ">

            <CalendarDays size={16} />

            <span>
              {currentDate}
            </span>

          </div>

          <div className="
            hidden h-8 w-px
            bg-workspace-border md:block
          " />

          {/* Workspace Identity */}

          <div className="flex items-center gap-3">

            <div className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-full
              border border-workspace-border
              bg-premium-card
              text-xs font-bold
              text-workspace-silver
            ">
              JX
            </div>

            <div className="hidden sm:block">

              <p className="
                text-sm font-semibold
                text-workspace-text
              ">
                JourneyFX
              </p>

              <p className="
                text-2xs text-workspace-muted
              ">
                Management Workspace
              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}

// ==================================================
// MOBILE BOTTOM NAVIGATION
// ==================================================

function MobileNavigation() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="
        fixed inset-x-0 bottom-0 z-header
        border-t border-workspace-border
        bg-workspace-sidebar/95
        backdrop-blur-xl
        lg:hidden
      "
      style={{
        paddingBottom:
          'env(safe-area-inset-bottom, 0px)',
      }}
    >

      <div className="grid grid-cols-3">

        {navigation.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex min-h-16 flex-col
                 items-center justify-center
                 gap-1.5 border-t-2
                 px-2 py-3 transition-colors
                 ${
                   isActive
                     ? 'border-metallic-silver bg-workspace-elevated text-workspace-text'
                     : 'border-transparent text-workspace-muted'
                 }`
              }
            >

              <Icon size={21} />

              <span className="
                text-2xs font-medium
                text-center
              ">
                {item.name}
              </span>

            </NavLink>
          );
        })}

      </div>

    </nav>
  );
}

// ==================================================
// PAGE TITLE & SCROLL MANAGEMENT
// ==================================================

function RouteManager() {

  const location = useLocation();

  useEffect(() => {

    const currentPage =
      navigation.find(
        (item) => item.path === location.pathname
      ) ?? navigation[0];

    document.title =
      `${currentPage.name} | ${APP.name}`;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });

  }, [location.pathname]);

  return null;
}

// ==================================================
// MAIN APPLICATION CONTENT
// ==================================================

function WorkspaceContent() {

  const location = useLocation();

  return (
    <div className="
      min-h-screen
      bg-workspace-background
      text-workspace-text
    ">

      <RouteManager />

      <Sidebar />

      <div className="
        flex min-h-screen flex-col
        lg:ml-sidebar
      ">

        <Header />

        <main
          id="main-content"
          className="
            mx-auto w-full max-w-workspace
            flex-1 px-4 py-6
            sm:px-6
            lg:px-8 lg:py-8
          "
        >

          {/* Development Mode Notice */}

          <div className="
            mb-6 flex items-start gap-3
            rounded-xl
            border border-workspace-border
            bg-workspace-surface
            px-4 py-3
          ">

            <ShieldCheck
              size={18}
              className="
                mt-0.5 shrink-0
                text-workspace-muted
              "
            />

            <p className="
              text-xs leading-relaxed
              text-workspace-muted
            ">
              Development Workspace — gunakan
              data simulasi hingga autentikasi
              dan pengamanan database diaktifkan.
            </p>

          </div>

          {/* Page Transition */}

          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.25,
              ease: 'easeOut',
            }}
          >

            <Routes>

              {/* Dashboard */}

              <Route
                path="/"
                element={<Dashboard />}
              />

              {/* Jobs & Project */}

              <Route
                path="/jobs-project"
                element={<JobsProject />}
              />

              {/* Management Report */}

              <Route
                path="/report"
                element={<Report />}
              />

              {/* Legacy Dashboard URL */}

              <Route
                path="/dashboard"
                element={
                  <Navigate to="/" replace />
                }
              />

              {/* Unknown Route */}

              <Route
                path="*"
                element={
                  <Navigate to="/" replace />
                }
              />

            </Routes>

          </motion.div>

        </main>

        {/* Application Footer */}

        <footer className="
          border-t border-workspace-border
          px-4 py-5
          sm:px-6 lg:px-8
          mb-24 lg:mb-0
        ">

          <div className="
            flex flex-col gap-2
            sm:flex-row
            sm:items-center
            sm:justify-between
          ">

            <p className="
              text-xs text-workspace-muted
            ">
              © 2026–2027 JourneyFX Workspace.
              All rights reserved.
            </p>

            <p className="
              text-2xs text-workspace-muted
            ">
              Internal Management System
              · V{APP.version}
            </p>

          </div>

        </footer>

      </div>

      <MobileNavigation />

    </div>
  );
}

// ==================================================
// MAIN APPLICATION
// ==================================================

export default function App() {
  return <WorkspaceContent />;
}

// ==================================================
// JOURNEYFX WORKSPACE
// One Team. One Workspace. One Direction.
// ==================================================
