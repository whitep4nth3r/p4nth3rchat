import { GiftSubEvent } from './types';
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

export interface GiftSubEvent {
  logoUrl: string;
  subscriberUsername: string;
  gifterUsername: string;
  subTier: string;
}

export interface SubEvent {
  logoUrl: string;
  subscriberUsername: string;
  subTier: string;
  message: string;
  months: number;
}

export enum Events {
  Follow = "follow",
  ChatMessage = "chatmessage",
  Cheer = "cheer",
  Sub = "sub",
  GiftSub = "giftsub"
}

export interface AlertQueueEvent {
  type: string;
  data: FollowEvent | HostEvent | SubEvent | GiftSubEvent;
}

export const MAX_MESSAGE_COUNT = 7;