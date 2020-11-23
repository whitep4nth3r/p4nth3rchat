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

export interface FollowEvent {
    followerUserId: string;
    logoUrl: string;
    followerName: string;
}

export interface HostEvent {
  viewerCount: number;
  hoster: string;
}

export enum Events {
  BroadcasterFollow = 'broadcasterfollow',
  ChatMessage = 'chatmessage',
  Host = 'host',
}

export type AlertQueueEvent = FollowEvent | HostEvent;
