/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as certificates from "../certificates.js";
import type * as dashboard from "../dashboard.js";
import type * as events from "../events.js";
import type * as files from "../files.js";
import type * as lib_eventDefaults from "../lib/eventDefaults.js";
import type * as lib_password from "../lib/password.js";
import type * as lib_publicRegistration from "../lib/publicRegistration.js";
import type * as lib_rbac from "../lib/rbac.js";
import type * as lib_session from "../lib/session.js";
import type * as lib_staffId from "../lib/staffId.js";
import type * as lib_staffUsers from "../lib/staffUsers.js";
import type * as payments from "../payments.js";
import type * as registrations from "../registrations.js";
import type * as seed from "../seed.js";
import type * as ticketTypes from "../ticketTypes.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  certificates: typeof certificates;
  dashboard: typeof dashboard;
  events: typeof events;
  files: typeof files;
  "lib/eventDefaults": typeof lib_eventDefaults;
  "lib/password": typeof lib_password;
  "lib/publicRegistration": typeof lib_publicRegistration;
  "lib/rbac": typeof lib_rbac;
  "lib/session": typeof lib_session;
  "lib/staffId": typeof lib_staffId;
  "lib/staffUsers": typeof lib_staffUsers;
  payments: typeof payments;
  registrations: typeof registrations;
  seed: typeof seed;
  ticketTypes: typeof ticketTypes;
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
