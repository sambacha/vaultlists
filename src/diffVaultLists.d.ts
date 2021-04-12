import { StrategyId } from './types';
export declare type StrategyIdChangeKey = Exclude<
  keyof StrategyId,
  'address' | 'chainId'
>;
export declare type StrategyIdChanges = Array<StrategyIdChangeKey>;
/**
 * Differences between a base list and an updated list.
 */
export interface TokenListDiff {
  /**
   * Tokens from updated with chainId/address not present in base list
   */
  readonly added: StrategyId[];
  /**
   * Tokens from base with chainId/address not present in the updated list
   */
  readonly removed: StrategyId[];
  /**
   * The token info that changed
   */
  readonly changed: {
    [chainId: number]: {
      [address: string]: StrategyIdChanges;
    };
  };
}
/**
 * Computes the diff of a deployed vault where the first argument is the base and the second argument is the updated list.
 * @param base base list
 * @param update updated list
 */
export declare function diffVaultLists(
  base: StrategyId[],
  update: StrategyId[],
): TokenListDiff;
