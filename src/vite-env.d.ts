/// <reference types="vite/client" />

// ==================================================
// JOURNEYFX WORKSPACE
// Internal Jobdesk & Project Management System
// Version 1.0.0
// Environment Type Declarations
// ==================================================


// ==================================================
// 01. ENVIRONMENT VARIABLES
// ==================================================

interface ImportMetaEnv {

  // Supabase Database Configuration
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;

  // Application Identity
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_VERSION?: string;
  readonly VITE_APP_URL?: string;
  readonly VITE_APP_ENV?: string;

  // Organization Configuration
  readonly VITE_ORGANIZATION_NAME?: string;
  readonly VITE_APP_TIMEZONE?: string;
  readonly VITE_APP_LOCALE?: string;

  // Development Configuration
  readonly VITE_DEMO_MODE?: string;

  // Optional Feature Configuration
  readonly VITE_ENABLE_NOTIFICATIONS?: string;
  readonly VITE_ENABLE_REPORT_EXPORT?: string;

}


// ==================================================
// 02. VITE ENVIRONMENT INTERFACE
// ==================================================

interface ImportMeta {

  readonly env: ImportMetaEnv;

}


// ==================================================
// 03. GLOBAL APPLICATION CONSTANTS
// Defined in vite.config.ts
// ==================================================

declare const __APP_NAME__: string;

declare const __APP_VERSION__: string;


// ==================================================
// JOURNEYFX WORKSPACE
// One Team. One Workspace. One Direction.
// ==================================================
