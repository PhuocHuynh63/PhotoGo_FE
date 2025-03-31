// tailwind.config.js

import { COLORS } from "@/constants/colors";


module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                text: {
                    orange: COLORS.TEXT.ORANGE,
                    light: COLORS.TEXT.LIGHT,
                    dark: COLORS.TEXT.DARK,
                    descriptionTitle: COLORS.TEXT.DESCRIPTION_TITLE,
                    description: COLORS.TEXT.DESCRIPTION,
                    successful: COLORS.TEXT.SUCCESSFUL,
                    pending: COLORS.TEXT.PENDING,
                    cancelled: COLORS.TEXT.CANCELLED,
                    changedCalendar: COLORS.TEXT.CHANGED_CALENDAR,
                    confirm: COLORS.TEXT.CONFIRM,
                    info: COLORS.TEXT.INFO,
                    error: COLORS.TEXT.ERROR,
                },
                bg: {
                    orange: COLORS.BACKGROUND.ORANGE,
                    orangeOpacity: COLORS.BACKGROUND.ORANGE_OPACITY,
                    orangeOpacity2: COLORS.BACKGROUND.ORANGE_OPACITY_2,
                    orangeDisabled: COLORS.BACKGROUND.ORANGE_DISABLED,
                    closed: COLORS.BACKGROUND.CLOSED,
                    dark: COLORS.BACKGROUND.DARK,
                    darkLinear: COLORS.BACKGROUND.DARK_LINEAR,
                    light: COLORS.BACKGROUND.LIGHT,
                    section: COLORS.BACKGROUND.SECTION,
                    input: COLORS.BACKGROUND.INPUT,
                    successful: COLORS.BACKGROUND.SUCCESSFUL,
                    pending: COLORS.BACKGROUND.PENDING,
                    cancelled: COLORS.BACKGROUND.CANCELLED,
                    changedCalendar: COLORS.BACKGROUND.CHANGED_CALENDAR,
                    confirm: COLORS.BACKGROUND.CONFIRM,
                    info: COLORS.BACKGROUND.INFO,
                    error: COLORS.BACKGROUND.ERROR,
                },
                border: {
                    orange: COLORS.BORDER.ORANGE,
                    orangeOpacity: COLORS.BORDER.ORANGE_OPACITY,
                    grey: COLORS.BORDER.GREY,
                    successful: COLORS.BORDER.SUCCESSFUL,
                    pending: COLORS.BORDER.PENDING,
                    cancelled: COLORS.BORDER.CANCELLED,
                    changedCalendar: COLORS.BORDER.CHANGED_CALENDAR,
                    confirm: COLORS.BORDER.CONFIRM,
                },
            },
            // Định nghĩa boxShadow
            boxShadow: {
                "orange": COLORS.BOX_SHADOW.ORANGE,
                "light": COLORS.BOX_SHADOW.LIGHT,
                "dark": COLORS.BOX_SHADOW.DARK,
                "successful": COLORS.BOX_SHADOW.SUCCESSFUL,
                "pending": COLORS.BOX_SHADOW.PENDING,
                "cancelled": COLORS.BOX_SHADOW.CANCELLED,
                "changedCalendar": COLORS.BOX_SHADOW.CHANGED_CALENDAR,
                "confirm": COLORS.BOX_SHADOW.CONFIRM,
            },
            // Định nghĩa gradient cho backgroundImage
            backgroundImage: {
                "gradient-orange": COLORS.GRADIENT.ORANGE,
                "gradient-light": COLORS.GRADIENT.LIGHT,
                "gradient-dark": COLORS.GRADIENT.DARK,
            },
        },
    },
    plugins: [],
};