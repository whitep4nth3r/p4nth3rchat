import { ChatMessageData } from './src/types';

const dummyMessage1: ChatMessageData = {
  userId: '469006291',
  username: 'whitep4nth3r',
  messageId: '889ec452-c7d1-49c1-b7a1-4c01855bb93f',
  message:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.',
  displayName: 'whitep4nth3r',
  emotes: null,
  isBroadcaster: true,
  isMod: false,
  isSubscriber: false,
  isTeamMember: true,
  isVip: false,
  logoUrl:
    'https://static-cdn.jtvnw.net/jtv_user_pictures/69ade2a2-82e1-477c-afc6-43582bf2844c-profile_image-300x300.png',
};

const dummyMessage2: ChatMessageData = {
  displayName: 'MadhouseSteve',
  emotes: null,
  isBroadcaster: false,
  isMod: true,
  isSubscriber: false,
  isTeamMember: false,
  isVip: false,
  logoUrl:
    'https://static-cdn.jtvnw.net/jtv_user_pictures/f2df91a8-e500-4407-9338-800e03ee6115-profile_image-300x300.png',
  message: 'YO!',
  messageId: '5d9ed1e6-c505-4e02-81df-81441352766b',
  userId: '76884091',
  username: 'madhousesteve',
};

const dummyMessage3: ChatMessageData = {
  displayName: 'Steffi128',
  emotes: { 555555560: Array(1) },
  isBroadcaster: false,
  isMod: true,
  isSubscriber: false,
  isTeamMember: false,
  isVip: false,
  logoUrl:
    'https://static-cdn.jtvnw.net/jtv_user_pictures/9565f024-f108-454a-92f9-74069faf9809-profile_image-300x300.png',
  message: 'More messages whitep30PEWPEW',
  messageId: '40d4d993-7d5a-4e26-9334-7a5bfc30835d',
  userId: '108211284',
  username: 'steffi128',
};

const dummyMessage4: ChatMessageData = {
  displayName: 'BaldBeardedBuilder',
  emotes: null,
  isBroadcaster: false,
  isMod: false,
  isSubscriber: true,
  isTeamMember: true,
  isVip: true,
  logoUrl:
    'https://static-cdn.jtvnw.net/jtv_user_pictures/49527525-10c9-4bb6-b5dc-03ba32acdd4d-profile_image-300x300.png',
  message:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.',
  messageId: 'bc3f8573-de8e-4671-80c1-a77ee54571f8',
  userId: '279965339',
  username: 'baldbeardedbuilder',
};
