export interface TourStep {
  id: string;
  title: string;
  text: string;
  element: string;
  on?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
}

export const TOUR_DEFINITIONS: Record<string, TourStep[]> = {
  '/dashboard': [
    {
      id: 'welcome',
      title: 'Dashboard Overview',
      text: 'This is your central analytics hub. Track overall accreditation progress and system activity here.',
      element: '.dashboard-title',
    },
    {
      id: 'stats',
      title: 'Current Metrics',
      text: 'High-level statistics across all programs, including document approval rates and active users.',
      element: '#stats-card',
    },
    {
      id: 'trends',
      title: 'Upload Trends',
      text: 'Visualize how your accreditation documentation is growing over time.',
      element: '#stats-card-left',
    },
    {
      id: 'logs',
      title: 'Recent Activity',
      text: 'The latest updates from coordinators and accreditors appear here in real-time.',
      element: '#stat-table',
    },
  ],
  '/manage-programs': [
    {
      id: 'manage-overview',
      title: 'Program Management',
      text: 'Here you can manage the accreditation levels for each program. Click on a program card to view its specific areas.',
      element: '.grid-cols-1',
    },
    {
        id: 'program-cards',
        title: 'Program Cards',
        text: 'Each card shows the current active level and status. You can edit or archive programs using the quick-actions.',
        element: '.relative.rounded-xl.border',
    }
  ],
  '/requests': [
    {
      id: 'request-list',
      title: 'Document Requests',
      text: 'Review and act on evidence uploads from coordinators. You can Approve, Reject, or Revert document statuses here.',
      element: '#request-table',
    },
    {
        id: 'request-actions',
        title: 'Batch Actions',
        text: 'Manage multiple requests at once using the checkboxes and status filters.',
        element: '.DataTable',
    }
  ],
  '/users': [
    {
      id: 'user-mgmt',
      title: 'User Access',
      text: 'Manage accounts and assign roles. Admin, Coordinator, or Accreditor permissions are controlled here.',
      element: '.user-mgmt-header',
    },
    {
      id: 'user-table',
      title: 'Account Detail',
      text: 'Use this table to search, edit, or disable user accounts across different programs.',
      element: '#user-table',
    },
  ],
  '/settings/profile': [
    {
      id: 'profile-settings',
      title: 'Profile Management',
      text: 'Update your personal information, email address, and account details here.',
      element: '.space-y-6',
    },
  ],
  '/settings/appearance': [
    {
      id: 'appearance-settings',
      title: 'Theme & Style',
      text: 'Customize the visual look of the portal to suit your preference.',
      element: '.space-y-6',
    },
  ],
  '/settings/password': [
    {
      id: 'password-settings',
      title: 'Security',
      text: 'Ensure your account stays secure by regularly updating your password.',
      element: '.space-y-6',
    },
  ],
  '/programs': [
    {
      id: 'program-list',
      title: 'Degree Programs',
      text: 'Every academic program with a planned or active accreditation survey is listed here.',
      element: '.programs-grid',
    },
    {
      id: 'search',
      title: 'Fast Filtering',
      text: 'Quickly find a specific degree level or program using this search utility.',
      element: '[placeholder*="Search programs"]',
    },
  ],
  '/area': [
    {
      id: 'area-params',
      title: 'Parameter Evidence',
      text: 'This section houses all official evidence and documentation for the selected Area.',
      element: '.parameter-accordion',
    },
    {
      id: 'files',
      title: 'Evidence Viewer',
      text: 'Click on any document to open it in our integrated PDF viewer for a smooth review process.',
      element: '.recursive-outline-container',
    },
  ],
};

export const FALLBACK_TOUR: TourStep[] = [
  {
    id: 'help',
    title: 'System Orientation',
    text: 'Press F1 on any page for a contextual guide. Use the sidebar to navigate between your assigned programs and areas.',
    element: 'body',
  },
];
