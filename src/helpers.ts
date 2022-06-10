export function isImage(file: File): boolean {
  return file.type.split('/')[0] === 'image'
}

export function convertBytesToMbsOrKbs(filesize: number): string {
  const KBYTE = 1024,
    MBYTE = 1_048_576
  let size = ''
  if (filesize >= MBYTE) {
    size = `${filesize / MBYTE} megabytes`
  } else if (filesize >= KBYTE) {
    size = `${filesize / KBYTE} kilobytes`
  } else {
    size = `${filesize} bytes`
  }
  return size
}

export async function createFileFromUrl(url: string): Promise<File> {
  const response = await fetch(url)
  const data = await response.blob()
  const metadata = { type: data.type }
  const filename = url.replace(/\?.+/, '').split('/').pop()
  return new File([data], filename ?? 'UNKNOWN.DAT', metadata)
}

export function readFile(file: File): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', (event) => {
      resolve((event?.target?.result as string) ?? null)
    })
    reader.addEventListener('error', (event) => {
      reader.abort()
      reject(event)
    })
    reader.readAsDataURL(file)
  })
}
