import React from "react";

export function AIChatPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background to-muted/20 flex justify-center items-start py-10">
      <div className="w-[90%] max-w-[1000px] h-[90vh] rounded-xl shadow-lg overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none z-10" />
        <iframe
          src="https://www.chatbase.co/chatbot-iframe/ezbmDF7y1swHSLXzZ9sOJ"
          width="100%"
          height="650px"
          frameBorder="0"
          allow="microphone; camera; clipboard-write; fullscreen"
          className="relative z-0"
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        />
      </div>
    </div>
  );
}
