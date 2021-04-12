import { StrategyId } from './types';

export type StrategyIdChangeKey = Exclude<
  keyof StrategyId,
  'address' | 'chainId'
>;
export type StrategyIdChanges = Array<StrategyIdChangeKey>;

/**
 * compares two token info key values
 * this subset of full deep equal functionality does not work on objects or object arrays
 * @param a comparison item a
 * @param b comparison item b
 */
function compareStrategyIdProperty(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.every((el, i) => b[i] === el);
  }
  return false;
}

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
export function diffVaultLists(
  base: StrategyId[],
  update: StrategyId[],
): TokenListDiff {
  const indexedBase = base.reduce<{
    [chainId: number]: { [address: string]: StrategyId };
  }>((memo, tokenInfo) => {
    if (!memo[tokenInfo.chainId]) memo[tokenInfo.chainId] = {};
    memo[tokenInfo.chainId][tokenInfo.address] = tokenInfo;
    return memo;
  }, {});

  const newListUpdates = update.reduce<{
    added: StrategyId[];
    changed: {
      [chainId: number]: {
        [address: string]: StrategyIdChanges;
      };
    };
    index: {
      [chainId: number]: {
        [address: string]: true;
      };
    };
  }>(
    (memo, tokenInfo) => {
      const baseToken = indexedBase[tokenInfo.chainId]?.[tokenInfo.address];
      if (!baseToken) {
        memo.added.push(tokenInfo);
      } else {
        const changes: StrategyIdChanges = Object.keys(tokenInfo)
          .filter(
            (s): s is StrategyIdChangeKey => s !== 'address' && s !== 'chainId',
          )
          .filter((s) => {
            return !compareStrategyIdProperty(tokenInfo[s], baseToken[s]);
          });
        if (changes.length > 0) {
          if (!memo.changed[tokenInfo.chainId]) {
            memo.changed[tokenInfo.chainId] = {};
          }
          memo.changed[tokenInfo.chainId][tokenInfo.address] = changes;
        }
      }

      if (!memo.index[tokenInfo.chainId]) {
        memo.index[tokenInfo.chainId] = {
          [tokenInfo.address]: true,
        };
      } else {
        memo.index[tokenInfo.chainId][tokenInfo.address] = true;
      }

      return memo;
    },
    { added: [], changed: {}, index: {} },
  );

  const removed = base.reduce<StrategyId[]>((list, curr) => {
    if (
      !newListUpdates.index[curr.chainId] ||
      !newListUpdates.index[curr.chainId][curr.address]
    ) {
      list.push(curr);
    }
    return list;
  }, []);

  return {
    added: newListUpdates.added,
    changed: newListUpdates.changed,
    removed,
  };
}
