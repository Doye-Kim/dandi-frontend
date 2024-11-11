const mainNavigations = {
  LOST: 'Lost',
  MAP: 'Map',
  BAG: 'Bag',
  NOTI: 'Noti',
  MY: 'My',
} as const;

const authNavigations = {
  AUTH_HOME: 'AuthHome',
  AUTH_EMAIL: 'AuthEmail',
  AUTH_PASSWORD: 'AuthPassword',
  AUTH_NAME: 'AuthName',
  EMAIL_CHECK: 'EmailCheck',
  LOGIN: 'Login',
  EMAIL_VERIFY: 'EmailVerify',
  PASSWORD_UPDATE: 'PasswordUpdate',
} as const;

const bagNavigations = {
  BAG_MAIN: 'BagMain',
  BAG_LIST: 'BagList',
  BAG_ITEM: 'BagItem',
} as const;

const lostNavigations = {
  PICKUP_LIST: 'PickupList',
  PICKUP_REGISTER: 'PickupRegister',
  PICKUP_DETAIL: 'PickupDetail',
  SOS_LIST: 'SOSList',
  SOS_REGISTER: 'SOSRegister',
  ROUTE_SELECTION: 'RouteSelection',
  SOS_DETAIL: 'SOSDetail',
} as const;

const myNavigations = {
  MY_MAIN: 'MyMain',
  PASSWORD_UPDATE: 'PasswordUpdate',
  MY_NOTI: 'MyNoti',
  MY_PICKUP: 'MyPickup',
} as const;

export {
  mainNavigations,
  authNavigations,
  bagNavigations,
  lostNavigations,
  myNavigations,
};
