export interface DeviceInfo {
  deviceType: 'pc' | 'mobile' | 'tablet';
  deviceModel: string;
}

export const getClientDeviceInfo = (): DeviceInfo => {
  if (typeof window === 'undefined' || !navigator) {
    return { deviceType: 'pc', deviceModel: 'Computadora' };
  }
  const ua = navigator.userAgent || '';
  let deviceType: 'pc' | 'mobile' | 'tablet' = 'pc';
  let deviceModel = 'Computadora';

  const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/i.test(ua);
  const isMobile = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua);

  if (isTablet) {
    deviceType = 'tablet';
    deviceModel = 'Tablet';
  } else if (isMobile) {
    deviceType = 'mobile';
    deviceModel = 'Celular';
  } else {
    deviceType = 'pc';
    deviceModel = 'Computadora';
  }

  if (/iPhone/i.test(ua)) {
    deviceType = 'mobile';
    deviceModel = 'Apple iPhone';
  } else if (/iPad/i.test(ua)) {
    deviceType = 'tablet';
    deviceModel = 'Apple iPad';
  } else if (/Android/i.test(ua)) {
    deviceType = 'mobile';
    const match = ua.match(/;\s*([^;]+?)\s*Build\//i) || ua.match(/Android[^;]*;\s*([^;)]+)/i);
    deviceModel = match && match[1] ? `Android (${match[1].trim()})` : 'Celular Android';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    deviceType = 'pc';
    deviceModel = 'Apple Mac';
  } else if (/Windows NT/i.test(ua)) {
    deviceType = 'pc';
    deviceModel = 'PC Windows';
  } else if (/Linux/i.test(ua)) {
    deviceType = 'pc';
    deviceModel = 'PC Linux';
  }

  return { deviceType, deviceModel };
};
