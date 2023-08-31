import {
    AppShell,
    Burger,
    Container,
    Header,
    MediaQuery,
    Navbar,
    Text,
    useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React, { useState } from 'react';
import ColourModeSwitch from './ColourModeSwitch';
import CartesiLogo from './Icons';

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const matches = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

    return (
        <AppShell
            styles={{
                main: {
                    background:
                        theme.colorScheme === 'dark'
                            ? theme.colors.dark[8]
                            : theme.colors.gray[0],
                },
            }}
            navbar={
                matches ? (
                    <Navbar
                        p="md"
                        hidden={!opened}
                        width={{ sm: 200, lg: 300 }}
                    >
                        <Text>Application navbar</Text>
                    </Navbar>
                ) : undefined
            }
            header={
                <Header height={{ base: 100 }} p="md">
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: '100%',
                        }}
                    >
                        <CartesiLogo />
                        <ColourModeSwitch />
                        <MediaQuery
                            largerThan="xs"
                            styles={{ display: 'none' }}
                        >
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="xl"
                            />
                        </MediaQuery>
                    </div>
                </Header>
            }
        >
            <Container bg={theme.colors.blue[8]}>{children}</Container>
        </AppShell>
    );
};

export default Layout;
