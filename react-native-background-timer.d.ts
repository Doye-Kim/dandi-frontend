declare module 'react-native-background-timer' {
  interface BackgroundTimer {
    setTimeout(callback: () => void, timeout: number): number;
    clearTimeout(timeoutId: number): void;
    setInterval(callback: () => void, timeout: number): number;
    clearInterval(intervalId: number): void;
    stopBackgroundTimer(): void;
    startBackgroundTimer(): void;
  }

  const BackgroundTimer: BackgroundTimer;
  export default BackgroundTimer;
}
