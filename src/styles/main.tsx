// ==================================================
// JOURNEYFX WORKSPACE
// Internal Jobdesk & Project Management System
// Version 1.0.0
// Main Application Entry Point
// ==================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import App from './App';

// Global Styles & Tailwind CSS
import './styles/global.css';

// ==================================================
// APPLICATION CONFIGURATION
// ==================================================

const APP_CONFIG = {
  name: 'JourneyFX Workspace',
  version: '1.0.0',
  environment: import.meta.env.MODE,
};

// ==================================================
// GLOBAL ERROR BOUNDARY
// ==================================================

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  componentDidCatch(
    error: Error,
    errorInfo: React.ErrorInfo
  ): void {

    if (import.meta.env.DEV) {
      console.error(
        'JourneyFX Workspace Error:',
        error,
        errorInfo
      );
    }

  }

  render(): React.ReactNode {

    if (this.state.hasError) {

      return (
        <div className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-workspace-background
          text-workspace-text
          p-6
        ">

          <div className="
            workspace-card
            max-w-md
            w-full
            text-center
          ">

            <div className="
              text-5xl
              font-black
              italic
              text-metallic
              mb-6
            ">
              J.
            </div>

            <h1 className="
              text-2xl
              font-semibold
              mb-3
            ">
              Something went wrong
            </h1>

            <p className="
              text-workspace-muted
              text-sm
              leading-relaxed
              mb-6
            ">
              Terjadi kendala saat menjalankan
              JourneyFX Workspace. Silakan muat
              ulang halaman untuk melanjutkan.
            </p>

            <button
              type="button"
              className="btn-primary w-full"
              onClick={() => window.location.reload()}
            >
              Reload Workspace
            </button>

            <p className="
              mt-6
              text-xs
              text-workspace-muted
            ">
              JourneyFX Workspace · V1.0.0
            </p>

          </div>

        </div>
      );

    }

    return this.props.children;

  }

}

// ==================================================
// INITIALIZE WEBSITE THEME
// ==================================================

document.documentElement.classList.add('dark');
document.documentElement.lang = 'id';

document.title =
  'JourneyFX Workspace | Jobdesk Management System';

// ==================================================
// APPLICATION ROOT
// ==================================================

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'JourneyFX Workspace: Root element not found.'
  );
}

// ==================================================
// DEVELOPMENT INFORMATION
// ==================================================

if (import.meta.env.DEV) {

  console.info(
    `${APP_CONFIG.name} V${APP_CONFIG.version}`
  );

  console.info(
    `Environment: ${APP_CONFIG.environment}`
  );

}

// ==================================================
// INITIALIZE REACT APPLICATION
// ==================================================

const root = ReactDOM.createRoot(rootElement);

root.render(

  <React.StrictMode>

    <ErrorBoundary>

      <BrowserRouter>

        {/* Main JourneyFX Application */}

        <App />

        {/* Global Notification System */}

        <Toaster

          position="top-right"

          reverseOrder={false}

          gutter={12}

          toastOptions={{

            duration: 4000,

            style: {
              background: '#15191E',
              color: '#F5F5F5',
              border: '1px solid #30353C',
              borderRadius: '12px',
              padding: '14px 18px',
              fontSize: '14px',
              maxWidth: '420px',
              boxShadow:
                '0 8px 32px rgba(0,0,0,0.30)',
            },

            success: {

              duration: 3000,

              iconTheme: {
                primary: '#34D399',
                secondary: '#15191E',
              },

            },

            error: {

              duration: 5000,

              iconTheme: {
                primary: '#F87171',
                secondary: '#15191E',
              },

            },

            loading: {

              iconTheme: {
                primary: '#D1D5DB',
                secondary: '#30353C',
              },

            },

          }}

        />

      </BrowserRouter>

    </ErrorBoundary>

  </React.StrictMode>

);

// ==================================================
// JOURNEYFX WORKSPACE
// One Team. One Workspace. One Direction.
// ==================================================
