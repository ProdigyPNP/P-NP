export declare const getGameStatus: () => Promise<GameStatus | null>;
export declare const getGameFile: (version: string) => Promise<string>;
export declare const logtraffic: () => void;
export declare const patchGameFile: (str: string, version: string) => string;
export declare const getPatchedGameFile: (version: string) => Promise<string>;
export declare const getPatchedPublicGameFile: (hash: string) => Promise<string>;
//# sourceMappingURL=util.d.ts.map