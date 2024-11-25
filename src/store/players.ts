import { createSlice, Slice, SliceCaseReducers } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

export const playersSliceName = "players";

export type playerColor = "red" | "blue" | "green" | "yellow";

export interface Player {
  name: string;
  color: playerColor;
}

export interface PlayerState {
  players: Player[];
  currentPlayerIndex: number;
}
export const initialPlayers: Player[] = [
  { name: "Player 1", color: "red" },
  { name: "Player 2", color: "blue" },
];
export const initialState: PlayerState = {
  players: initialPlayers,
  currentPlayerIndex: Math.floor(Math.random() * initialPlayers.length),
};

export const ADD_PLAYER = "player/addPlayer";
export const REMOVE_PLAYER = "player/removePlayer";
export const NEXT_TURN = "player/nextTurn";
export const LAST_TURN = "player/lastTurn";
export const RESET_PLAYERS = "player/resetPlayers";
export const SET_PLAYER_COLOR = "player/setPlayerColor";

export const playerSlice: Slice<
  any,
  SliceCaseReducers<any>,
  string
> = createSlice({
  name: playersSliceName,
  initialState,
  reducers: {
    [RESET_PLAYERS]: (state) => {
      state.players = initialPlayers;
      state.currentPlayerIndex = Math.floor(Math.random() * initialPlayers.length);
    },
    [ADD_PLAYER]: (state) => {
      state.players.push({
        name: `Player ${state.players.length + 1}`,
        color: ["red", "blue", "green", "yellow"].find((color:string) => !state.players.map((player:Player) => player.color).includes(color)) || "red",
      });
    },
    [REMOVE_PLAYER]: (state, action) => {
      state.players = state.players.filter(
        (player: Player) => player.color !== action.payload.color
      );
    },
    [NEXT_TURN]: (state) => {
      state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    },
    [LAST_TURN]: (state) => {
      state.currentPlayerIndex = state.currentPlayerIndex ? (state.currentPlayerIndex - 1) : state.players.length - 1;
      console.log(state.currentPlayerIndex);
    },
    [SET_PLAYER_COLOR]: (state, action) => {
      state.players[action.payload.index].color = action.payload.color;
    }
  },
});

export const resetPlayers = playerSlice.actions[RESET_PLAYERS];
export const addPlayer = playerSlice.actions[ADD_PLAYER];
export const removePlayer = playerSlice.actions[REMOVE_PLAYER];
export const nextTurn = playerSlice.actions[NEXT_TURN];
export const lastTurn = playerSlice.actions[LAST_TURN];
export const setPlayerColor = playerSlice.actions[SET_PLAYER_COLOR];

export default playerSlice.reducer;

export const usePlayers = () => {
  return useSelector((state: any) => state[playersSliceName].players);
}
export const useCurrentPlayerIndex = () => {
  return useSelector((state: any) => state[playersSliceName].currentPlayerIndex);
}
