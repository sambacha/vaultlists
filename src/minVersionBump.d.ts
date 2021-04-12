import { VersionUpgrade } from './getVersionUpgrade';
import { StrategyId } from './types';
/**
 * Returns the minimum version bump for the given list
 * @param baseList the base list of vaults
 * @param updatedList the updated list of vaults
 */
export declare function minVersionBump(
  baseList: StrategyId[],
  updatedList: StrategyId[],
): VersionUpgrade;
