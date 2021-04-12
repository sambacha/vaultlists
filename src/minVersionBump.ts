import { diffVaultLists } from './diffVaultLists';
import { VersionUpgrade } from './getVersionUpgrade';
import { StrategyId } from './types';

/**
 * Returns the minimum version bump for the given list
 * @param baseList the base list of vaults
 * @param updatedList the updated list of vaults
 */
export function minVersionBump(
  baseList: StrategyId[],
  updatedList: StrategyId[],
): VersionUpgrade {
  const diff = diffVaultLists(baseList, updatedList);
  if (diff.removed.length > 0) return VersionUpgrade.MAJOR;
  if (diff.added.length > 0) return VersionUpgrade.MINOR;
  if (Object.keys(diff.changed).length > 0) return VersionUpgrade.PATCH;
  return VersionUpgrade.NONE;
}
