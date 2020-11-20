export interface ChatMessageData {
  userId: string;
  username: string;
  displayName: string;
  messageId: string;
  message: string;
  logoUrl: string;
  isMod: boolean;
  isVip: boolean;
  isSubscriber: boolean;
  isBroadcaster: boolean;
  isTeamMember: boolean;
  emotes?: {
    [emoteid: string]: string[];
  };
  type: string | undefined;
}

export interface BroadcasterFollowData {
    followerUserId: string;
    logoUrl: string;
    followerName: string;
}

export enum PermittedEvents {
  BroadcasterFollow = 'broadcasterfollow',
  ChatMessage = 'chatmessage',
}
