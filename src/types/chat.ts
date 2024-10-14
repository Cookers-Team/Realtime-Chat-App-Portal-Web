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
}

interface Message {
  _id: string;
  user: {
    _id: string;
    displayName: string;
    avatarUrl: string;
  };
  content: string;
  createAt: string;
}

interface ChatWindowProps {
  conversation: {
    _id: string;
    name: string;
  };
}
export type { Conversation, Message, ChatWindowProps };
