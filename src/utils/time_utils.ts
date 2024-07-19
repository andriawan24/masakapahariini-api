export function parseCookTimeToMinute(cookTime: string): number {
  const cookTimeSplit = cookTime.split(' ')
  if (cookTimeSplit.length > 1) {
    const hour = Number(cookTimeSplit[0].replace('jam', '')) * 60
    const minute = Number(cookTimeSplit[1].replace('mnt', ''))
    return hour + minute
  } else {
    if (cookTimeSplit[0].endsWith('jam')) {
      return Number(cookTimeSplit[0].replace('jam', '')) * 60
    } else {
      return Number(cookTimeSplit[0].replace('mnt', ''))
    }
  }
}