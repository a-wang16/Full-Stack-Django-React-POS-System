import React, { useEffect,useRef } from 'react';

/**
 * Google translate component that allows for language selection for the whole web page
 */
function GoogleTranslate() {
    const googleTranslateRef = useRef(null);

    useEffect(() => {
      let intervalID;
    
      const checkTranslate = () => {
        if(window.google && window.google.translate){
          clearInterval(intervalID);
          new window.google.translate.TranslateElement(
            {
              pageLangauge: 'en',
              layout: 'google.translate.TranslateElement.InlineLayout.SIMPLE'
            },
            googleTranslateRef.current
          );
        }
      };
      intervalID = setInterval(checkTranslate, 100);

    }, []);

      return (
        <div>
          <div ref = {googleTranslateRef}></div>
        </div>
      );
};

export default GoogleTranslate;