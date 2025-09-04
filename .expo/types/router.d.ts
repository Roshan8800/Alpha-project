/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/goals` | `/(tabs)/invest` | `/(tabs)/profile` | `/(tabs)/wallet` | `/_sitemap` | `/about` | `/goals` | `/invest` | `/profile` | `/wallet`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
