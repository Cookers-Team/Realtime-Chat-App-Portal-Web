interface Conversation {
  _id: string;
  name: string;
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
    avatarUrl: string;
    totalMembers: number;
  };
}
export type { Conversation, Message, ChatWindowProps };
