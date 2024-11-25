import { createSlice, Slice, SliceCaseReducers } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { shuffle } from "../utils";

export const deckSliceName = "deck";

export type CardType = "1" | "2" | "3" | "-4" | "5" | "7" | "8" | "10" | "11" | "12" | "Not Sorry!";
export const CardText: Record<CardType, string> = {
    "1": "Move one pawn from Start or move one pawn one space forward.",
    "2": "Move one pawn from Start or two spaces forward. Draw Again!",
    "3": "Move three spaces forward.",
    "-4": "Move one pawn backward four spaces.",
    "5": "Move one pawn forward five spaces.",
    "7": "Move one pawn forward seven spaces or split the seven spaces between pawns.",
    "8": "Move one pawn eight spaces forward.",
    "10": "Move one pawn ten spaces forward or one space backward.",
    "11": "Move eleven spaces forward or switch places with any one opposing pawn.",
    "12": "Move twelve spaces forward.",
    "Not Sorry!": "Move one pawn from Start to the space of an opposing pawn."
};

export interface Card {
    type: CardType;
    text: string;
}

export interface DeckState {
    cards: Card[];
    drawnCards: Card[];
    currentCard: Card | null;
}

export const unshuffeledDeck: string[] = ["1","1","1","1","1", "2","2","2","2", "3","3","3","3", "-4","-4","-4","-4", "5","5","5","5", "7","7","7","7", "8","8","8","8", "10","10","10","10", "11","11","11","11", "12","12","12","12", "Not Sorry!","Not Sorry!","Not Sorry!","Not Sorry!"];

export const initialState: DeckState = {
    cards: shuffle(unshuffeledDeck).map((type) => ({ type, text: CardText[type as CardType] })),
    drawnCards: [],
    currentCard: null
};

export const SHUFFLE = "deck/shuffle";
export const DRAW_CARD = "deck/drawCard";
export const RESET_DECK = "deck/resetDeck";
export const UNDO_DRAW = "deck/undoDraw";

export const deckSlice: Slice<any, SliceCaseReducers<any>, string> = createSlice({
    name: deckSliceName,
    initialState,
    reducers: {
        [SHUFFLE]: (state) => {
            state.cards = state.cards.sort(() => Math.random() - 0.5);
        },
        [DRAW_CARD]: (state) => {
            if (state.currentCard) {
                state.drawnCards.push(state.currentCard);
            }
            if (!state.cards.length) {
                state.cards = shuffle(state.drawnCards).map((type) => ({
                  type,
                  text: CardText[type as CardType],
                }));
                state.drawnCards = [];
            }
            state.currentCard = state.cards[0];
            state.cards.shift();
        },
        [RESET_DECK]: (state) => {
            state.cards = shuffle(unshuffeledDeck).map((type) => ({
              type,
              text: CardText[type as CardType],
            }));
            state.drawnCards = [];
            state.currentCard = null;
        },
        [UNDO_DRAW]: (state) => {
            if (!state.drawnCards.length) {
                return;
            }
            state.cards.unshift(state.currentCard);
            state.currentCard = state.drawnCards.pop();
        }
    },
});

export const shuffleDeck = deckSlice.actions[SHUFFLE];
export const drawCard = deckSlice.actions[DRAW_CARD];
export const resetDeck = deckSlice.actions[RESET_DECK];
export const undoDraw = deckSlice.actions[UNDO_DRAW];

export const useDeck = (): DeckState => {
    return useSelector((state: any) => state[deckSliceName]);
};
export const useCurrentCard = (): Card | null => {
    return useSelector((state: any) => state[deckSliceName].currentCard);
};

export const getDeck = (state: any): DeckState => {
    return state[deckSliceName];
};

export const getCurrentCard = (state: any): Card | null => {
    return state[deckSliceName].currentCard;
};
