/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Converts an optional string into a Regex case insensitive and global
 */
export function isRegexpStringMatch(
  regexAsString?: string,
  valueToTest?: string,
): boolean {
  if (
    typeof regexAsString === 'undefined' ||
    typeof valueToTest === 'undefined'
  ) {
    return false;
  }

  return new RegExp(regexAsString, 'gi').test(valueToTest);
}
