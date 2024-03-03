import { create } from "zustand";


export type matchAnalyticsType = {
    avatar: string;
    name: string;
    score: number;
    winner: boolean;
};

export type MatchType = {
    map(arg0: (matchData: { player1: matchAnalyticsType, player2: matchAnalyticsType }, index: import("react").Key | null | undefined) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
    player1: matchAnalyticsType;
    player2: matchAnalyticsType;
};

type StoreMatchType = {
    match: null | MatchType;
    setMatch: (matchData: MatchType) => void;
};

export const matchStore = create<StoreMatchType>((set) => ({
    match: null,
    setMatch(matchData) {
        set({ match: matchData });
    },
}));