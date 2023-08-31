import {
    ColorScheme,
    ColorSchemeProvider,
    MantineProvider,
} from '@mantine/core';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React, { useState } from 'react';
import Layout from '../ui/components/Layout';

export default function App({ Component, pageProps }: AppProps) {
    const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    return (
        <>
            <Head>
                <title>Rollups Explorer</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <ColorSchemeProvider
                colorScheme={colorScheme}
                toggleColorScheme={toggleColorScheme}
            >
                <MantineProvider
                    withNormalizeCSS
                    withGlobalStyles
                    theme={{ colorScheme }}
                >
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </MantineProvider>
            </ColorSchemeProvider>
        </>
    );
}
