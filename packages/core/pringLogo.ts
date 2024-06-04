export default function () {
  if (PROD) {
    const logo = `
________________________________________________

   _______        __        _______  _______ 
  |    ___|.----.|__|.----.|   |   ||_     _|
  |    ___||   _||  ||  __||   |   | _|   |_ 
  |_______||__|  |__||____||_______||_______|
                                           
________________________________________________
              author:EricWXY
`;

    const rainbowGradient = `
background: linear-gradient(135deg, orange 60%, cyan);
background-clip: text;
color: transparent;
font-size: 16px; 
line-height: 1;
font-family: monospace;
font-weight: 600;
`;

    console.info(`%c${logo}`, rainbowGradient);
  } else if (DEV) {
    console.log("[EricUI]:dev mode...");
  }
}
