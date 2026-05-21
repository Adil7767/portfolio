export const ANALYTICS_EVENTS = {
  PORTFOLIO_VIEW: "portfolio_view",
  RESUME_DOWNLOAD: "resume_download",
  PROJECTS_LOAD_MORE: "projects_load_more",
  PROJECT_READ_MORE: "project_read_more",
  PROJECT_DETAIL_VIEW: "project_detail_view",
  PROJECT_LINK_CLICK: "project_link_click",
  CONTACT_SUBMIT: "contact_submit",
} as const;

export type AnalyticsEventType =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
