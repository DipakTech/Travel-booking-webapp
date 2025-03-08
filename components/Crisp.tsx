"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

export function Crisp() {
  const CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

  useEffect(() => {
    if (!CRISP_WEBSITE_ID) return;

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;

    // Initialize Crisp
    (function () {
      const d = document;
      const s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = true;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();

    // Configure Crisp
    window.$crisp.push(["do", "chat:hide"]);
    window.$crisp.push([
      "on",
      "chat:closed",
      () => {
        window.$crisp.push(["do", "chat:hide"]);
      },
    ]);

    // Set user data if available
    // Uncomment and modify this section when you have user data
    // if (user) {
    //   window.$crisp.push(['set', 'user:email', user.email]);
    //   window.$crisp.push(['set', 'user:nickname', user.name]);
    // }

    // Show Crisp after a delay for better page load performance
    setTimeout(() => {
      window.$crisp.push(["do", "chat:show"]);
    }, 2000);

    // Cleanup
    return () => {
      // Remove Crisp chat on component unmount if needed
      const crisp = document.getElementById("crisp-chat");
      if (crisp) {
        crisp.remove();
      }
    };
  }, [CRISP_WEBSITE_ID]);

  return null;
}
