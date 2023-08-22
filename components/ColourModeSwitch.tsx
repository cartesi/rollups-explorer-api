import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import React from 'react';

const ColourModeSwitch = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const color = dark ? 'cyan' : 'teal';

    return (
        <ActionIcon
            variant="outline"
            size="xl"
            color={color}
            onClick={() => toggleColorScheme()}
            title="toggle between light and dark mode"
        >
            {dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
        </ActionIcon>
    );
};

export default ColourModeSwitch;
