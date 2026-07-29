/**
 * Canonical taxonomy — mirrors backend/schemas/taxonomy.py exactly.
 * This is the single source of truth for the frontend's category/theme
 * vocabulary and fixed display order. Do not redefine these lists elsewhere.
 */

export const CATEGORIES = [
  'Billing & Payments',
  'Account & Access',
  'Performance & Reliability',
  'Functional Issues',
  'Feature Requests & Enhancements',
  'Usability & User Experience',
  'Support Experience',
  'Other',
] as const

export type Category = (typeof CATEGORIES)[number]

export const SENTIMENTS = ['Positive', 'Neutral', 'Negative'] as const
export type Sentiment = (typeof SENTIMENTS)[number]

export const URGENCIES = ['High', 'Medium', 'Low'] as const
export type Urgency = (typeof URGENCIES)[number]

export const CATEGORY_THEMES: Record<Category, string[]> = {
  'Billing & Payments': [
    'Failed Payment',
    'Duplicate Charge',
    'Refund Delay',
    'Unexpected Charge',
    'Subscription/Renewal Issue',
  ],
  'Account & Access': [
    'Login Failure',
    'Password Reset',
    'OTP/2FA Problem',
    'Account Locked',
    'Profile Settings Issue',
    'Unauthorized Access',
  ],
  'Performance & Reliability': [
    'App Crash',
    'Slow Performance',
    'Downtime/Outage',
    'Timeout Error',
    'High Resource Usage',
  ],
  'Functional Issues': [
    'Function Not Working',
    'Incorrect Data Displayed',
    'UI Element Broken',
    'Sync Issue',
    'Validation Error',
  ],
  'Feature Requests & Enhancements': [
    'New Feature Request',
    'Enhancement Request',
    'Integration Request',
    'Workflow Improvement',
  ],
  'Usability & User Experience': [
    'Confusing Navigation',
    'Poor Layout',
    'Hard to Find Feature',
    'Accessibility Issue',
    'Positive Experience',
  ],
  'Support Experience': [
    'Slow Response',
    'Unhelpful Agent',
    'Issue Unresolved',
    'Difficult to Reach Support',
  ],
  Other: ['General Feedback', 'Unclear'],
}
