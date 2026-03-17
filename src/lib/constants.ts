export const STORAGE_KEYS = {
    user: "chronoflow_user",
    chronotype: "chronoflow_chronotype",
    tasks: "chronoflow_tasks",
  } as const;
  
  export const APP_ROUTES = {
    home: "/",
    chronotypes: "/chronotypes",
    assessment: "/assessment",
    rhythm: "/rhythm",
    dashboard: "/dashboard",
    planner: "/planner",
    insights: "/insights",
    learn: "/learn",
    kit: "/kit",
    faq: "/faq",
    method: "/method",
    profile: "/profile",
    login: "/auth/login",
    signup: "/auth/signup",
    forgotPassword: "/auth/forgot-password",
    admin: "/admin",
    adminUsers: "/admin/users",
    adminAssessments: "/admin/assessments",
    adminContent: "/admin/content",
    adminProduct: "/admin/product",
    adminReports: "/admin/reports",
  } as const;
  
  export const DEFAULT_SLEEP_TIME = "11:00 PM";
  export const DEFAULT_WAKE_TIME = "07:00 AM";
  
  export const ALIGNMENT_SCORE_BASE = 60;
  export const ALIGNMENT_SCORE_BONUS_PER_COMPLETED_TASK = 8;
  export const ALIGNMENT_SCORE_MAX = 95;