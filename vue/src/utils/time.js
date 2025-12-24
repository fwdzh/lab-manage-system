export function formatDateTime(isoString) {
  let date
  if (isoString instanceof Date) {
    date = isoString
  } else if (typeof isoString === 'string') {
    date = new Date(isoString)
  } else {
    throw new Error('参数必须是 Date 对象或 ISO 时间字符串')
  }
  if (isNaN(date.getTime())) {
    throw new Error('错误的时间格式')
  }

  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  const res = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  return res
}
