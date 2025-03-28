export default function manifest() {
  return {
    name: 'U-Reserve',
    short_name: 'U-Reserve',
    description: 'Created and managed by Kelompok 1',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}