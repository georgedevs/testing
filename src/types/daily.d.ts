interface DailyCallFrame {
    on(event: 'left-meeting', callback: () => void): DailyCallFrame;
    join(options: { url: string; token: string }): Promise<void>;
  }
  
  interface DailyIframeFactory {
    createFrame(options: {
      iframeStyle: {
        top:number;
        left:number;
        position: string;
        width: string;
        height: string;
        border: string;
        zIndex:number;
      };
      showLeaveButton: boolean;
      showFullscreenButton: boolean;
      dailyConfig:any
    }): Promise<DailyCallFrame>;
  }
  
  declare global {
    interface Window {
      DailyIframe: DailyIframeFactory;
    }
  }
  
  export {};