export const fileTypeOption = [
  {
    label: 'PDF',
    value: 'pdf'
  },
  {
    label: 'DOCX',
    value: 'docx'
  },
  {
    label: 'XLSX',
    value: 'xlsx'
  },
  {
    label: 'PPTX',
    value: 'pptx'
  },
  {
    label: 'JPG',
    value: 'jpg'
  },
  {
    label: 'JPEG',
    value: 'jpeg'
  },
  {
    label: 'PNG',
    value: 'png'
  },
  {
    label: 'WebP',
    value: 'webp'
  },
  {
    label: 'MP4',
    value: 'mp4'
  },
  {
    label: 'M4a',
    value: 'm4a'
  },
  {
    label: 'WAV',
    value: 'wav'
  },

  {
    label: 'MOV',
    value: 'mov'
  },
  {
    label: 'MP3',
    value: 'mp3'
  },
  {
    label: 'MSG',
    value: 'msg'
  },
  {
    label: 'CSV',
    value: 'csv'
  }
];
export enum EFileType {
  Single = 0,
  Multiple = 1
}
export const fileFolder = [
  { value: EFileType.Single, label: 'Single' },
  { value: EFileType.Multiple, label: 'Multiple' }
];
