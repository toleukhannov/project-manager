export const formattedDate = (createdAt: string) => (new Date(createdAt).toLocaleString('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}));
