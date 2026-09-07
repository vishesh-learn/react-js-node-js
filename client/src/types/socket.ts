export interface MessageData {
  author: string;
  text: string;
}

export interface ServerToClientEvents {
  message: (data: MessageData) => void;
  hello: (data: string) => void;
  connectionCount: (data: number) => void;
}