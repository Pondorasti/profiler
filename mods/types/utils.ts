/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export type ExtractReturnType = <V>(arg1: (...args: any[]) => V) => V;

/**
 * This type serves as documentation for how an array is meant to be used, but does
 * not support type checking. We often use an Array instead of a Map to translate
 * one type of index into another type of index. This is similar to how we use the
 * Map<K,V> type, but with the Array.
 */
// eslint-disable-next-line no-unused-vars
export type IndexedArray<_IndexType, Value> = Array<Value>;

/**
 * This type is equivalent to {[string]: T} for an object created without a prototype,
 * e.g. Object.create(null).
 *
 * See: https://github.com/facebook/flow/issues/4967#issuecomment-402355640
 */
export type ObjectMap<T> = {
  [key: string]: T;
  // No prototype was created:
  // @ts-ignore-next-line
  __proto__: null;
};

export type MixedObject = {
  [key: string]: unknown;
};
