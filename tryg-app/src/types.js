/**
 * @fileoverview Core type definitions for Tryg App
 * 
 * These JSDoc typedefs provide IDE autocomplete and type checking
 * without requiring TypeScript. Import this file in hooks/components.
 * 
 * Usage: Add `// @ts-check` at the top of a file to enable type checking.
 */

// ============================================================================
// CORE DATA MODELS
// ============================================================================

/**
 * A task in the Senior's daily routine
 * @typedef {Object} Task
 * @property {string} id - Unique ID (e.g. "task_123")
 * @property {string} title - Display title (e.g. "Tag medicin")
 * @property {boolean} completed - Is it done?
 * @property {'morgen' | 'frokost' | 'eftermiddag' | 'aften'} period - Time of day
 * @property {string} [time] - Optional specific time (e.g. "09:00")
 * @property {string} [description] - Optional description
 * @property {string} [type] - Task type (e.g. "medication", "appointment")
 * @property {Object} [completedAt] - Firestore timestamp when completed
 */

/**
 * A member of a care circle (Senior or Relative)
 * @typedef {Object} Member
 * @property {string} docId - The Firestore User ID
 * @property {string} displayName - Name to show in UI
 * @property {'senior' | 'relative'} role - User role
 * @property {'home' | 'work' | 'traveling' | 'available' | 'busy'} status - Current status
 * @property {Object} [updatedAt] - Firestore timestamp
 */

/**
 * A symptom log entry
 * @typedef {Object} Symptom
 * @property {string} id - Unique ID
 * @property {string} type - Symptom type (e.g. "headache", "fatigue")
 * @property {string} [location] - Body location if applicable
 * @property {Object} loggedAt - Firestore timestamp
 */

/**
 * A care circle (family group)
 * @typedef {Object} CareCircle
 * @property {string} id - Circle ID
 * @property {string} seniorId - User ID of the Senior
 * @property {string} seniorName - Display name of the Senior
 * @property {string} inviteCode - Code for relatives to join
 * @property {Object} createdAt - Firestore timestamp
 */

/**
 * User profile from Firestore
 * @typedef {Object} UserProfile
 * @property {string} email - User email
 * @property {string} displayName - Display name
 * @property {'senior' | 'relative'} role - User role
 * @property {string} [careCircleId] - Associated care circle
 * @property {boolean} consentGiven - GDPR consent status
 * @property {Object} [consentTimestamp] - When consent was given
 */

/**
 * A ping ("Thinking of You" notification)
 * @typedef {Object} Ping
 * @property {string} id - Unique ID
 * @property {string} fromName - Sender's display name
 * @property {string} fromUid - Sender's user ID
 * @property {'senior' | 'relative'} toRole - Target role
 * @property {Object} sentAt - Firestore timestamp
 */

/**
 * Help offer/request in HelpExchange
 * @typedef {Object} HelpItem
 * @property {string} id - Item ID (e.g. "cook", "drive")
 * @property {string} label - Display label
 * @property {string} emoji - Emoji icon
 * @property {string} createdByUid - Creator's user ID
 * @property {'senior' | 'relative'} createdByRole - Creator's role
 * @property {Object} createdAt - Firestore timestamp
 */

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================

/**
 * Return type for useTasks hook
 * @typedef {Object} UseTasksReturn
 * @property {Task[]} tasks - Array of tasks
 * @property {(id: string) => Promise<void>} toggleTask - Toggle task completion
 * @property {(task: Partial<Task>) => Promise<void>} addTask - Add a new task
 */

/**
 * Return type for useMemberStatus hook
 * @typedef {Object} UseMemberStatusReturn
 * @property {Member[]} memberStatuses - All members in the circle
 * @property {Member[]} relativeStatuses - Only relatives
 * @property {Member} [seniorStatus] - The senior's status
 * @property {string} myStatus - Current user's status
 * @property {(status: string) => Promise<void>} setMyStatus - Update own status
 */

/**
 * Return type for useCareCircleContext hook
 * @typedef {Object} CareCircleContextValue
 * @property {string} careCircleId - Care circle ID
 * @property {string} seniorId - Senior's user ID
 * @property {string} seniorName - Senior's display name
 * @property {string} currentUserId - Current user's ID
 * @property {'senior' | 'relative'} userRole - Current user's role
 * @property {string} userName - Current user's display name
 * @property {Member[]} memberStatuses - All member statuses
 * @property {Member[]} relativeStatuses - Relative statuses only
 * @property {Member} [seniorStatus] - Senior's status
 * @property {string} myStatus - Current user's status
 * @property {(status: string) => void} setMyStatus - Update own status
 */

export { };
