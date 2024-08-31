/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0B3142'; // Dark Blue from your palette
const tintColorDark = '#F5FBEF'; // Light Beige from your palette

export const Colors = {
  light: {
    text: '#11181C', // Keep or update to a color from your palette if needed
    background: '#F5FBEF', // Light Beige
    tint: tintColorLight, // Dark Blue
    icon: '#687076', // Consider updating to match your palette
    tabIconDefault: '#687076', // Consider updating to match your palette
    tabIconSelected: tintColorLight, // Dark Blue
  },
  dark: {
    text: '#ECEDEE', // Light color for dark mode, consider updating to match your palette
    background: '#151718', // Dark color for dark mode, consider updating to match your palette
    tint: tintColorDark, // Light Beige
    icon: '#9BA1A6', // Consider updating to match your palette
    tabIconDefault: '#9BA1A6', // Consider updating to match your palette
    tabIconSelected: tintColorDark, // Light Beige
  },
};
