/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import type { TabSlug } from "~/components/FFP/app-logic/tabs-handling";
import type { TransformType } from "~/components/FFP/types";

/**
 * This file contains utils that help Flow understand things better. Occasionally
 * statements can be logically equivalent, but Flow infers them in a specific way. Most
 * of the time tweaks can be done by editing the type system, but occasionally functions
 * are needed to get the desired result.
 */

/**
 * This function can be run as the default arm of a switch statement to ensure exhaustive
 * checking of a given type. It relies on an assumption that all cases will be handled
 * and the input to the function will be empty. This function hopefully makes that check
 * more readable.
 */
export function assertExhaustiveCheck(
  notValid: never,
  errorMessage: string = `There was an unhandled case for the value: "${notValid}"`
): void {
  throw new Error(errorMessage);
}

/**
 * Immutably update an object through Object.assign, but retain the original
 * type information of the object. Flow will occasionally throw errors when
 * inferring what is going on with Object.assign.
 */
export function immutableUpdate<T>(object: T, ...rest: any[]): T {
  return Object.assign({}, object, ...rest);
}

/**
 * This function will take an arbitrary string, and try to convert it to a valid
 * TransformType.
 */
export function convertToTransformType(type: string): TransformType | null {
  // Coerce this into a TransformType even if it's not one.
  const coercedType = type as TransformType;
  switch (coercedType) {
    // Exhaustively check each TransformType. The default arm will assert that
    // we have been exhaustive.
    case "merge-call-node":
    case "merge-function":
    case "focus-subtree":
    case "focus-function":
    case "focus-category":
    case "collapse-resource":
    case "collapse-direct-recursion":
    case "collapse-indirect-recursion":
    case "collapse-function-subtree":
    case "drop-function":
      return coercedType;
    default: {
      // The coerced type SHOULD be empty here. If in reality we get
      // here, then it's not a valid transform type, so return null.
      coercedType as never;
      return null;
    }
  }
}

/**
 * This function coerces one type into another type.
 * This is equivalent to: (((value: A): any): B)
 */
export function coerce<A, B>(item: A): B {
  return item as any;
}

/**
 * It can be helpful to coerce one type that matches the shape of another.
 */
export function coerceMatchingShape<T>(item: Partial<T>): T {
  return item as any;
}

/**
 * This is a type-friendly version of Object.values that assumes the object has
 * a Map-like structure.
 */
export function objectValues<
  Value,
  Obj extends {
    [key: string]: Value;
  }
>(object: Obj): Value[] {
  return (Object.values as any)(object);
}

/**
 * This is a type-friendly version of Object.entries that assumes the object has
 * a Map-like structure.
 */
export function objectEntries<Key extends string | number | symbol, Value>(
  object: Partial<Record<Key, Value>>
): Array<[Key, Value]> {
  return (Object.entries as any)(object);
}

/**
 * This is a type-friendly version of Object.entries that assumes the object has
 * a Map-like structure.
 */
export function objectMap<Return, Key extends string | number | symbol, Value>(
  object: Partial<Record<Key, Value>>,
  fn: (arg1: Value, arg2: Key) => Return
): Partial<Record<Key, Return>> {
  const result: Partial<Record<Key, Return>> = {};
  for (const [key, value] of objectEntries(object)) {
    result[key] = fn(value, key);
  }
  return result;
}

// Generic bounds with an Object is a false positive.
export function getObjectValuesAsUnion<T extends Record<any, any>>(obj: T): Array<T[keyof T]> {
  return Object.values(obj);
}

export function ensureExists<T>(item?: T | null, message?: string | null): T {
  if (item === null) {
    throw new Error(message || "Expected an item to exist, and it was null.");
  }
  if (item === undefined) {
    throw new Error(message || "Expected an item to exist, and it was undefined.");
  }
  return item;
}

/**
 * Returns the first item from Set in a type friendly manner.
 */
export function getFirstItemFromSet<T>(set: Set<T>): T | undefined {
  return set.values().next().value;
}
