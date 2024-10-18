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

interface ConversationMembers {
  _id: string;
  user: {
    _id: string;
    displayName: string;
    avatarUrl: string;
  };
  canMessage: Number;
  canAddMember: Number;
  canUpdate: Number;
  isOwner: Number;
}

interface Friends {
  _id: string;
  friend: {
    _id: string;
    displayName: string;
    avatarUrl: string;
    lastLogin: string;
  };
  conversation: {
    _id: string;
  };
}

export type {
  Conversation,
  Message,
  ChatWindowProps,
  ConversationMembers,
  Friends,
};
