module.exports = {
    sections: [
        {
            name: 'Components',
            components: 'src/components/**/*.{js,jsx,ts,tsx}',
            exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
            usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
        },
        {
            name: 'Utilities',
            components: 'src/utils/**/*.{js,jsx,ts,tsx}',
            exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
            usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
        },
        {
            name: 'Pages',
            components: 'src/pages/**/*.{js,jsx,ts,tsx}',
            exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
            usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
        }
    ]
}