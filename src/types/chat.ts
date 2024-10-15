interface Conversation {
  _id: string;
  name: string;
  kind: Number;
  lastMessage: {
    content: string;
    createdAt: string;
    user: {
      displayName: string;
    };
  };
  avatarUrl: string;
  totalMembers: number;
}

interface Message {
  _id: string;
  user: {
    _id: string;
    displayName: string;
    avatarUrl: string;
  };
  content: string;
  createdAt: string;
}

interface ChatWindowProps {
  conversation: {
    _id: string;
    name: string;
    kind: Number;
    avatarUrl: string;
    totalMembers: number;
  };
}

interface Friends {
  _id: string;
  reciever: {
    _id: string;
    displayName: string;
    avatarUrl: string;
  };
}

export type { Conversation, Message, ChatWindowProps, Friends };
