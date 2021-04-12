/**
 * compares two token info key values
 * this subset of full deep equal functionality does not work on objects or object arrays
 * @param a comparison item a
 * @param b comparison item b
 */
function compareStrategyIdProperty(a, b) {
    if (a === b)
        return true;
    if (typeof a !== typeof b)
        return false;
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.every(function (el, i) { return b[i] === el; });
    }
    return false;
}
/**
 * Computes the diff of a deployed vault where the first argument is the base and the second argument is the updated list.
 * @param base base list
 * @param update updated list
 */
export function diffVaultLists(base, update) {
    var indexedBase = base.reduce(function (memo, tokenInfo) {
        if (!memo[tokenInfo.chainId])
            memo[tokenInfo.chainId] = {};
        memo[tokenInfo.chainId][tokenInfo.address] = tokenInfo;
        return memo;
    }, {});
    var newListUpdates = update.reduce(function (memo, tokenInfo) {
        var _a;
        var _b;
        var baseToken = (_b = indexedBase[tokenInfo.chainId]) === null || _b === void 0 ? void 0 : _b[tokenInfo.address];
        if (!baseToken) {
            memo.added.push(tokenInfo);
        }
        else {
            var changes = Object.keys(tokenInfo)
                .filter(function (s) { return s !== "address" && s !== "chainId"; })
                .filter(function (s) {
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
            memo.index[tokenInfo.chainId] = (_a = {},
                _a[tokenInfo.address] = true,
                _a);
        }
        else {
            memo.index[tokenInfo.chainId][tokenInfo.address] = true;
        }
        return memo;
    }, { added: [], changed: {}, index: {} });
    var removed = base.reduce(function (list, curr) {
        if (!newListUpdates.index[curr.chainId] || !newListUpdates.index[curr.chainId][curr.address]) {
            list.push(curr);
        }
        return list;
    }, []);
    return {
        added: newListUpdates.added,
        changed: newListUpdates.changed,
        removed: removed
    };
}
//# sourceMappingURL=diffVaultLists.js.map