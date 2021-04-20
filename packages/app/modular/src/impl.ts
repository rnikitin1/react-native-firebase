import * as web from 'firebase/app';
import { FirebaseApp, FirebaseAppConfig, FirebaseOptions } from './types';
import FirebaseAppImpl from './implementations/firebaseApp';
import { defaultAppName } from './common';

/**
 * Converts a `web.FirebaseApp` into `FirebaseApp`.
 *
 * @param app
 * @returns
 */
function convertFirebaseApp(app: web.FirebaseApp): FirebaseApp {
  return new FirebaseAppImpl(app.name, app.options, {
    automaticDataCollectionEnabled: app.automaticDataCollectionEnabled,
  });
}

/**
 * Finds a `web.FirebaseApp` by name.
 *
 * Using `web.getApp()` throws an error if not found, so this is a safe check.
 *
 * @param name
 * @returns
 */
function getFirebaseApp(name = defaultAppName): web.FirebaseApp | undefined {
  return web.getApps().find(app => app.name === name);
}

export { SDK_VERSION } from 'firebase/app';

export async function deleteApp(name: string) {
  const app = getFirebaseApp(name);

  if (!app) {
    return;
  }

  return web.deleteApp(app);
}

export function getApp(name?: string): FirebaseApp | undefined {
  // Find via the `getApps` array rather than via `getApp` so no error is thrown.
  const app = getFirebaseApp(name);

  if (app) {
    return convertFirebaseApp(app);
  }

  return;
}

export function getApps(): FirebaseApp[] {
  return web.getApps().map(convertFirebaseApp);
}

export function initializeApp(options: FirebaseOptions, config?: FirebaseAppConfig): FirebaseApp {
  const app = web.initializeApp(options, config);
  return convertFirebaseApp(app);
}

export function setAutomaticDataCollectionEnabled(name: string, enabled: boolean) {
  const app = getFirebaseApp(name);

  if (app) {
    app.automaticDataCollectionEnabled = enabled;
  }
}
