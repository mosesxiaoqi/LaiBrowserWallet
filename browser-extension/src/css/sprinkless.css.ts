import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

// import { borderRadius, colors, spacing } from '@reown/appkit-ui-new'

const flexAlignments = ['flex-start', 'flex-end', 'center']

const borderRadius = {
  '1': '4px',
  // @TOOD: 6px doesn't exist in design system. Remove this.
  '6': '6px',
  '2': '8px',
  // @TOOD: 10px doesn't exist in design system. Remove this.
  '10': '10px',
  '3': '12px',
  '4': '16px',
  '5': '20px',
  '8': '32px',
  '16': '64px',
  '20': '80px',
  '32': '128px',
  '64': '256px',
  '128': '512px',
  round: '9999px'
}

// const borderRadius: {
//   '1': string;
//   '6': string;
//   '2': string;
//   '10': string;
//   '3': string;
//   '4': string;
//   '5': string;
//   '8': string;
//   '16': string;
//   '20': string;
//   '32': string;
//   '64': string;
//   '128': string;
//   round: string;
// };

export const colors = {
  /* Main colors */
  black: '#202020',
  white: '#FFFFFF',

  /* Accent colors */
  accent010: 'rgba(9, 136, 240, 0.1)',
  accent020: 'rgba(9, 136, 240, 0.2)',
  accent030: 'rgba(9, 136, 240, 0.3)',
  accent040: 'rgba(9, 136, 240, 0.4)',
  accent050: 'rgba(9, 136, 240, 0.5)',
  accent060: 'rgba(9, 136, 240, 0.6)',
  accent070: 'rgba(9, 136, 240, 0.7)',
  accent080: 'rgba(9, 136, 240, 0.8)',
  accent090: 'rgba(9, 136, 240, 0.9)',
  accent100: 'rgba(9, 136, 240, 1.0)',

  accentSecondary010: 'rgba(199, 185, 148, 0.1)',
  accentSecondary020: 'rgba(199, 185, 148, 0.2)',
  accentSecondary030: 'rgba(199, 185, 148, 0.3)',
  accentSecondary040: 'rgba(199, 185, 148, 0.4)',
  accentSecondary050: 'rgba(199, 185, 148, 0.5)',
  accentSecondary060: 'rgba(199, 185, 148, 0.6)',
  accentSecondary070: 'rgba(199, 185, 148, 0.7)',
  accentSecondary080: 'rgba(199, 185, 148, 0.8)',
  accentSecondary090: 'rgba(199, 185, 148, 0.9)',
  accentSecondary100: 'rgba(199, 185, 148, 1.0)',

  /* Product colors */
  productWalletKit: '#FFB800',
  productAppKit: '#FF573B',
  productCloud: '#0988F0',
  productDocumentation: '#008847',

  /* Neutrals colors */
  neutrals050: '#F6F6F6',
  neutrals100: '#F3F3F3',
  neutrals200: '#E9E9E9',
  neutrals300: '#D0D0D0',
  neutrals400: '#BBB',
  neutrals500: '#9A9A9A',
  neutrals600: '#6C6C6C',
  neutrals700: '#4F4F4F',
  neutrals800: '#363636',
  neutrals900: '#2A2A2A',
  neutrals1000: '#252525',

  /* Semantic colors */
  semanticSuccess010: 'rgba(48, 164, 107, 0.1)',
  semanticSuccess020: 'rgba(48, 164, 107, 0.2)',
  semanticSuccess030: 'rgba(48, 164, 107, 0.3)',
  semanticSuccess040: 'rgba(48, 164, 107, 0.4)',
  semanticSuccess050: 'rgba(48, 164, 107, 0.5)',
  semanticSuccess060: 'rgba(48, 164, 107, 0.6)',
  semanticSuccess070: 'rgba(48, 164, 107, 0.7)',
  semanticSuccess080: 'rgba(48, 164, 107, 0.8)',
  semanticSuccess090: 'rgba(48, 164, 107, 0.9)',
  semanticSuccess100: 'rgba(48, 164, 107, 1.0)',

  semanticError010: 'rgba(223, 74, 52, 0.1)',
  semanticError020: 'rgba(223, 74, 52, 0.2)',
  semanticError030: 'rgba(223, 74, 52, 0.3)',
  semanticError040: 'rgba(223, 74, 52, 0.4)',
  semanticError050: 'rgba(223, 74, 52, 0.5)',
  semanticError060: 'rgba(223, 74, 52, 0.6)',
  semanticError070: 'rgba(223, 74, 52, 0.7)',
  semanticError080: 'rgba(223, 74, 52, 0.8)',
  semanticError090: 'rgba(223, 74, 52, 0.9)',
  semanticError100: 'rgba(223, 74, 52, 1.0)',

  semanticWarning010: 'rgba(243, 161, 63, 0.1)',
  semanticWarning020: 'rgba(243, 161, 63, 0.2)',
  semanticWarning030: 'rgba(243, 161, 63, 0.3)',
  semanticWarning040: 'rgba(243, 161, 63, 0.4)',
  semanticWarning050: 'rgba(243, 161, 63, 0.5)',
  semanticWarning060: 'rgba(243, 161, 63, 0.6)',
  semanticWarning070: 'rgba(243, 161, 63, 0.7)',
  semanticWarning080: 'rgba(243, 161, 63, 0.8)',
  semanticWarning090: 'rgba(243, 161, 63, 0.9)',
  semanticWarning100: 'rgba(243, 161, 63, 1.0)'
}

// @TODO: Provide proper values to something sm, md, lg, xl, etc.
export const spacing = {
  '01': '2px',
  '1': '4px',
  '2': '8px',
  '3': '12px',
  '4': '16px',
  '5': '20px',
  '6': '24px',
  '7': '28px',
  '8': '32px',
  '9': '36px',
  '10': '40px',
  '12': '48px',
  '14': '56px',
  '16': '64px',
  '20': '80px',
  '32': '128px',
  '64': '256px'
}

const dimensions = {
  '1': '1px',
  '2': '2px',
  '4': '4px',
  '8': '8px',
  '12': '12px',
  '20': '20px',
  '24': '24px',
  '28': '28px',
  '30': '30px',
  '32': '32px',
  '34': '34px',
  '36': '36px',
  '40': '40px',
  '44': '44px',
  '48': '48px',
  '49': '49px',
  '50': '50px',
  '54': '54px',
  '56': '56px',
  '62': '62px',
  '64': '64px',
  '106': '106px',
  '140': '140px',
  '180': '180px',
  '200': '200px',
  '320': '320px',
  '360': '360px',
  '490': '490px',
  '565': '565px',
  full: '100%',
  auto: 'auto',
  max: 'max-content',
  screen: '100vh'
}

const unresponsiveProperties = defineProperties({
  properties: {
    alignSelf: flexAlignments,
    backgroundSize: ['cover'] as const,
    flex: ['1', '0.5'],
    opacity: ['1', '0.7', '0.5'],
    borderRadius,
    backgroundClip: ['text'],
    WebkitBackgroundClip: ['text'],
    WebkitTextFillColor: ['transparent'],
    display: ['block', 'flex', 'none'],
    alignItems: [...flexAlignments, 'baseline'],
    willChange: ['transform'],
    borderStyle: {
      solid: 'solid'
    },
    borderWidth: {
      '0': '0px',
      '1': '1px',
      '2': '2px',
      '4': '4px'
    },
    cursor: ['pointer', 'none'],
    pointerEvents: ['none', 'all'],
    minHeight: {
      ...dimensions,
      full: '100vh'
    },
    flexDirection: ['row', 'column'],
    fontSize: {
      '12': { fontSize: '12px', lineHeight: '18px' },
      '13': { fontSize: '13px', lineHeight: '18px' },
      '14': { fontSize: '14px', lineHeight: '18px' },
      '16': { fontSize: '16px', lineHeight: '20px' },
      '18': { fontSize: '18px', lineHeight: '24px' },
      '20': { fontSize: '20px', lineHeight: '24px' },
      '23': { fontSize: '23px', lineHeight: '29px' },
      '40': { fontSize: '40px', lineHeight: '62px' },
      '120': { fontSize: '120px', lineHeight: '144px' }
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      heavy: '800'
    },
    flexWrap: ['wrap'],
    gap: spacing,
    height: dimensions,
    justifyContent: [...flexAlignments, 'space-between', 'space-around'],
    textAlign: ['left', 'center', 'inherit'],
    marginBottom: spacing,
    marginLeft: { ...spacing, auto: 'auto' },
    marginRight: spacing,
    marginTop: spacing,
    maxWidth: dimensions,
    minWidth: dimensions,
    overflow: ['hidden'] as const,
    paddingBottom: spacing,
    paddingLeft: spacing,
    paddingRight: spacing,
    paddingTop: spacing,
    position: ['absolute', 'fixed', 'relative'],
    WebkitUserSelect: ['none'],
    border: ['none'],
    outlineWidth: ['0'],
    right: {
      '0': '0'
    },
    transition: {
      default: '0.125s ease',
      transform: 'transform 0.125s ease'
    },
    userSelect: ['none', 'auto'] as const,
    width: dimensions
  } as const,
  shorthands: {
    margin: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
    marginX: ['marginLeft', 'marginRight'],
    marginY: ['marginTop', 'marginBottom'],
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom']
  }
})

const colorProperties = defineProperties({
  conditions: {
    base: {},
    hover: { selector: '&:hover' },
    active: { selector: '&:active' }
  },
  defaultCondition: 'base',
  properties: {
    background: colors,
    borderColor: colors,
    color: colors
  }
})

export const sprinkles = createSprinkles(colorProperties, unresponsiveProperties)

export type Sprinkles = Parameters<typeof sprinkles>[0]
