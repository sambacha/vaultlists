export interface StrategyId {
  readonly chainId: number;
  readonly address: string;
  readonly name: string;
  readonly decimals: number;
  readonly symbol: string;
  readonly logoURI?: string;
  readonly tags?: string[];
}

export interface Version {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

export interface Tags {
  readonly [tagId: string]: {
    readonly name: string;
    readonly description: string;
  };
}

export interface Registry {
  readonly name: string;
  readonly timestamp: string;
  readonly version: Version;
  readonly vaults: StrategyId[];
  readonly keywords?: string[];
  readonly tags?: Tags;
  readonly logoURI?: string;
}
