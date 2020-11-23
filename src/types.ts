export interface ChatMessageEvent {
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
  hosterName: string;
  logoUrl: string;
}

export enum Events {
  Follow = "follow",
  ChatMessage = "chatmessage",
  Cheer = "cheer",
  Sub = "sub"
}

export interface AlertQueueEvent {
  type: string;
  data: FollowEvent | HostEvent;
}

export const MAX_MESSAGE_COUNT = 7;