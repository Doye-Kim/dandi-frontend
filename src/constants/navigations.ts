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
  AUTH_PHONE: 'AuthPhone',
  AUTH_NAME: 'AuthName',
  EMAIL_CHECK: 'EmailCheck',
  LOGIN: 'Login',
} as const;

const bagNavigations = {
  BAG_MAIN: 'BagMain',
} as const;

const lostNavigations = {
  PICKUP_LIST: 'PickupList',
  PICKUP_DETAIL: 'PickupDetail',
} as const;

export { mainNavigations, authNavigations, bagNavigations, lostNavigations };
