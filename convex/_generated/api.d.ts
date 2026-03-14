/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as __tests___helpers from "../__tests__/helpers.js";
import type * as applications from "../applications.js";
import type * as auth from "../auth.js";
import type * as bugReports from "../bugReports.js";
import type * as candidateProfiles from "../candidateProfiles.js";
import type * as companyProfiles from "../companyProfiles.js";
import type * as e2e from "../e2e.js";
import type * as http from "../http.js";
import type * as messages from "../messages.js";
import type * as moderatedActions from "../moderatedActions.js";
import type * as moderation from "../moderation.js";
import type * as moderationHelpers from "../moderationHelpers.js";
import type * as notifications from "../notifications.js";
import type * as positions from "../positions.js";
import type * as reports from "../reports.js";
import type * as seed from "../seed.js";
import type * as uploads from "../uploads.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "__tests__/helpers": typeof __tests___helpers;
  applications: typeof applications;
  auth: typeof auth;
  bugReports: typeof bugReports;
  candidateProfiles: typeof candidateProfiles;
  companyProfiles: typeof companyProfiles;
  e2e: typeof e2e;
  http: typeof http;
  messages: typeof messages;
  moderatedActions: typeof moderatedActions;
  moderation: typeof moderation;
  moderationHelpers: typeof moderationHelpers;
  notifications: typeof notifications;
  positions: typeof positions;
  reports: typeof reports;
  seed: typeof seed;
  uploads: typeof uploads;
  users: typeof users;
  utils: typeof utils;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
