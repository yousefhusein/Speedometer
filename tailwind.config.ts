import { Config } from 'tailwindcss'

export default <Partial<Config>>{
    content: ['index.html', 'src/**/*.{tsx,ts,jsx,js}'],
    darkMode: 'media',
    theme: {
        extend: {},
    },
}
