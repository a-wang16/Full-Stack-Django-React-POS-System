import React, { useEffect } from 'react';

const GoogleTranslate = () => {
    useEffect(() => {
      const googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false
          },
          "google_translate_element"
        );
      };
    
      window.googleTranslateElementInit = googleTranslateElementInit;
    }, []);

      return (
        <div id="google_translate_element"></div>
      );
};

export default GoogleTranslate;