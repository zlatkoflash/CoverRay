import localFont from 'next/font/local';

// --- Individual Static Declarations ---
const aclonica = localFont({ src: '../assets/fonts/Aclonica-Regular.ttf', variable: '--font-aclonica', display: 'swap' });
const alex = localFont({ src: '../assets/fonts/ALEX____.ttf', variable: '--font-alex', display: 'swap' });
const allanBold = localFont({ src: '../assets/fonts/Allan-Bold.ttf', variable: '--font-allan-bold', display: 'swap' });
const allanRegular = localFont({ src: '../assets/fonts/Allan-Regular.ttf', variable: '--font-allan-regular', display: 'swap' });
const averiaBold = localFont({ src: '../assets/fonts/Averia-Bold.ttf', variable: '--font-averia-bold', display: 'swap' });
const averiaBoldItalic = localFont({ src: '../assets/fonts/Averia-BoldItalic.ttf', variable: '--font-averia-bold-italic', display: 'swap' });
const averiaGruesa = localFont({ src: '../assets/fonts/Averia-Gruesa.ttf', variable: '--font-averia-gruesa', display: 'swap' });
const averiaItalic = localFont({ src: '../assets/fonts/Averia-Italic.ttf', variable: '--font-averia-italic', display: 'swap' });
const averiaLight = localFont({ src: '../assets/fonts/Averia-Light.ttf', variable: '--font-averia-light', display: 'swap' });
const averiaRegular = localFont({ src: '../assets/fonts/Averia-Regular.ttf', variable: '--font-averia-regular', display: 'swap' });
const balooBhaijaan = localFont({ src: '../assets/fonts/BalooBhaijaan-Regular.ttf', variable: '--font-baloo-bhaijaan', display: 'swap' });
const balooBhaina = localFont({ src: '../assets/fonts/BalooBhaina-Regular.ttf', variable: '--font-baloo-bhaina', display: 'swap' });
const balooBhai = localFont({ src: '../assets/fonts/BalooBhai-Regular.ttf', variable: '--font-baloo-bhai', display: 'swap' });
const balooChettan = localFont({ src: '../assets/fonts/BalooChettan-Regular.ttf', variable: '--font-baloo-chettan', display: 'swap' });
const balooDa = localFont({ src: '../assets/fonts/BalooDa-Regular.ttf', variable: '--font-baloo-da', display: 'swap' });
const balooPaaji = localFont({ src: '../assets/fonts/BalooPaaji-Regular.ttf', variable: '--font-baloo-paaji', display: 'swap' });
const balooRegular = localFont({ src: '../assets/fonts/Baloo-Regular.ttf', variable: '--font-baloo-regular', display: 'swap' });
const balooTamma = localFont({ src: '../assets/fonts/BalooTamma-Regular.ttf', variable: '--font-baloo-tamma', display: 'swap' });
const balooTammudu = localFont({ src: '../assets/fonts/BalooTammudu-Regular.ttf', variable: '--font-baloo-tammudu', display: 'swap' });
const balooThambi = localFont({ src: '../assets/fonts/BalooThambi-Regular.ttf', variable: '--font-baloo-thambi', display: 'swap' });
const barrio = localFont({ src: '../assets/fonts/Barrio-Regular.ttf', variable: '--font-barrio', display: 'swap' });
const cairo = localFont({ src: '../assets/fonts/Cairo.ttf', variable: '--font-cairo', display: 'swap' });
const cookie = localFont({ src: '../assets/fonts/Cookie-Regular.ttf', variable: '--font-cookie', display: 'swap' });
const cuprumBold = localFont({ src: '../assets/fonts/Cuprum-Bold.ttf', variable: '--font-cuprum-bold', display: 'swap' });
const cuprumBoldItalic = localFont({ src: '../assets/fonts/Cuprum-BoldItalic.ttf', variable: '--font-cuprum-bold-italic', display: 'swap' });
const cuprumItalic = localFont({ src: '../assets/fonts/Cuprum-Italic.ttf', variable: '--font-cuprum-italic', display: 'swap' });
const cuprumRegular = localFont({ src: '../assets/fonts/Cuprum-Regular.ttf', variable: '--font-cuprum-regular', display: 'swap' });
const fjordOne = localFont({ src: '../assets/fonts/FjordOne-Regular.ttf', variable: '--font-fjord-one', display: 'swap' });
const gupterBold = localFont({ src: '../assets/fonts/Gupter-Bold.ttf', variable: '--font-gupter-bold', display: 'swap' });
const gupterMedium = localFont({ src: '../assets/fonts/Gupter-Medium.ttf', variable: '--font-gupter-medium', display: 'swap' });
const gupterRegular = localFont({ src: '../assets/fonts/Gupter-Regular.ttf', variable: '--font-gupter-regular', display: 'swap' });
const limelight = localFont({ src: '../assets/fonts/Limelight.ttf', variable: '--font-limelight', display: 'swap' });
const linkinPark = localFont({ src: '../assets/fonts/Linkin Park ExtraBold.ttf', variable: '--font-linkin-park', display: 'swap' });
const mysteryQuest = localFont({ src: '../assets/fonts/MysteryQuest-Regular.ttf', variable: '--font-mystery-quest', display: 'swap' });

// --- Exported Array for your UI Dropdown ---
export const customFonts = [
  { name: 'Aclonica Regular', variable: '--font-aclonica', instance: aclonica },
  { name: 'Alex', variable: '--font-alex', instance: alex },
  { name: 'Allan Bold', variable: '--font-allan-bold', instance: allanBold },
  { name: 'Allan Regular', variable: '--font-allan-regular', instance: allanRegular },
  { name: 'Averia Bold', variable: '--font-averia-bold', instance: averiaBold },
  { name: 'Averia Bold Italic', variable: '--font-averia-bold-italic', instance: averiaBoldItalic },
  { name: 'Averia Gruesa', variable: '--font-averia-gruesa', instance: averiaGruesa },
  { name: 'Averia Italic', variable: '--font-averia-italic', instance: averiaItalic },
  { name: 'Averia Light', variable: '--font-averia-light', instance: averiaLight },
  { name: 'Averia Regular', variable: '--font-averia-regular', instance: averiaRegular },
  { name: 'Baloo Bhaijaan', variable: '--font-baloo-bhaijaan', instance: balooBhaijaan },
  { name: 'Baloo Bhaina', variable: '--font-baloo-bhaina', instance: balooBhaina },
  { name: 'Baloo Bhai', variable: '--font-baloo-bhai', instance: balooBhai },
  { name: 'Baloo Chettan', variable: '--font-baloo-chettan', instance: balooChettan },
  { name: 'Baloo Da', variable: '--font-baloo-da', instance: balooDa },
  { name: 'Baloo Paaji', variable: '--font-baloo-paaji', instance: balooPaaji },
  { name: 'Baloo Regular', variable: '--font-baloo-regular', instance: balooRegular },
  { name: 'Baloo Tamma', variable: '--font-baloo-tamma', instance: balooTamma },
  { name: 'Baloo Tammudu', variable: '--font-baloo-tammudu', instance: balooTammudu },
  { name: 'Baloo Thambi', variable: '--font-baloo-thambi', instance: balooThambi },
  { name: 'Barrio Regular', variable: '--font-barrio', instance: barrio },
  { name: 'Cairo', variable: '--font-cairo', instance: cairo },
  { name: 'Cookie Regular', variable: '--font-cookie', instance: cookie },
  { name: 'Cuprum Bold', variable: '--font-cuprum-bold', instance: cuprumBold },
  { name: 'Cuprum Bold Italic', variable: '--font-cuprum-bold-italic', instance: cuprumBoldItalic },
  { name: 'Cuprum Italic', variable: '--font-cuprum-italic', instance: cuprumItalic },
  { name: 'Cuprum Regular', variable: '--font-cuprum-regular', instance: cuprumRegular },
  { name: 'Fjord One Regular', variable: '--font-fjord-one', instance: fjordOne },
  { name: 'Gupter Bold', variable: '--font-gupter-bold', instance: gupterBold },
  { name: 'Gupter Medium', variable: '--font-gupter-medium', instance: gupterMedium },
  { name: 'Gupter Regular', variable: '--font-gupter-regular', instance: gupterRegular },
  { name: 'Limelight', variable: '--font-limelight', instance: limelight },
  { name: 'Linkin Park ExtraBold', variable: '--font-linkin-park', instance: linkinPark },
  { name: 'Mystery Quest Regular', variable: '--font-mystery-quest', instance: mysteryQuest }
];

// --- String of all variables for the page wrapper ---
export const allEditorFontVariables = customFonts.map(f => f.instance.variable).join(' ');