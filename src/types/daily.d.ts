interface DailyCallFrame {
    on(event: 'left-meeting', callback: () => void): DailyCallFrame;
    join(options: { url: string; token: string }): Promise<void>;
  }
  
  interface DailyIframeFactory {
    createFrame(options: {
      iframeStyle: {
        position: string;
        width: string;
        height: string;
        border: string;
        backgroundColor: string;
      };
      showLeaveButton: boolean;
      showFullscreenButton: boolean;
    }): Promise<DailyCallFrame>;
  }
  
  declare global {
    interface Window {
      DailyIframe: DailyIframeFactory;
    }
  }
  
  export {};