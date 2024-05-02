import React, { useEffect } from 'react';

/**
 * Google translate component that allows for language selection for the whole web page
 */
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