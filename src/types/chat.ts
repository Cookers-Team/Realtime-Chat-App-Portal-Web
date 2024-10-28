interface UserProfile {
  _id: string;
  displayName: string;
  avatarUrl: string;
  secretKey: string;
}
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
  isOwner: number;
  owner: {
    _id: string;
  };
  lastLogin: string;
  avatarUrl: string;
  totalMembers: number;
  canMessage: Number;
  canAddMember: Number;
  canUpdate: Number;
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
    lastLogin: string;
    isOwner: number;
    owner: {
      _id: string;
    };
    canMessage: Number;
    canAddMember: Number;
    canUpdate: Number;
  };
  userCurrent: UserProfile | null;
}

interface ConversationMembers {
  _id: string;
  user: {
    _id: string;
    displayName: string;
    avatarUrl: string;
  };
  isOwner: number;
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
  UserProfile,
};
