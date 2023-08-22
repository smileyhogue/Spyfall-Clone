// types.ts

export type Player = {
    id: string;
    name: string;
  };
  
  export type GameSession = {
    host: Player;
    players: Player[];
  };
  
  export type Games = {
    [key: string]: GameSession;
  };
  