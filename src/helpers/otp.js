export function generateOtp() {
  const otp = Math.round(Math.random() * 1000000);
  return otp;
}

export function validateExpiredOtp(data = {}) {
  const nowTime = new Date();
  const dataTime = new Date(data.updatedAt);
  const setTime = 5 * 60; // in minutes

  const timeDifferenceInSeconds = Math.floor(
    (nowTime.getTime() - dataTime.getTime()) / 1000 // in second
  );

  if (timeDifferenceInSeconds < setTime) {
    return false;
  }
  return true;
}
