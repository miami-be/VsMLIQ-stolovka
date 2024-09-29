import { theme } from 'antd'
import { Inter } from 'next/font/google'

const interFont = Inter({
  subsets: ['latin'],
})

export const Theme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // Colors
    colorPrimary: '#4CAF50',
    colorError: '#FF5252',
    colorInfo: '#2196F3',
    colorSuccess: '#4CAF50',
    colorWarning: '#FFC107',
    colorTextBase: '#212121',
    colorLink: '#2196F3',
    colorBgBase: '#F5F5F5',
    colorBgContainer: '#FFFFFF',
    colorBorder: '#E0E0E0',
    colorBorderSecondary: '#EEEEEE',
    colorSplit: 'rgba(0, 0, 0, 0.08)',
    // Typography
    fontFamily: `${interFont.style.fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial`,
    fontSize: 16,
    fontSizeHeading1: 40,
    fontSizeHeading2: 32,
    fontSizeHeading3: 26,
    linkDecoration: 'none',

    //Form
    controlItemBgActive: '#E8F5E9',
    controlOutline: 'rgba(76, 175, 80, 0.2)',
    controlHeight: 44,
    controlHeightSM: 36,

    // Layout
    padding: 20,
    boxShadow:
      '0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 2px 8px -1px rgba(0, 0, 0, 0.05), 0 4px 6px 0 rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    lineType: 'solid',
    lineWidth: 1,
    motion: true,
  },
  components: {
    Form: {
      itemMarginBottom: '28px',
    },

    Layout: {
      headerBg: '#FFFFFF',
      footerBg: '#F5F5F5',
      bodyBg: '#F5F5F5',
      siderBg: '#FFFFFF',
    },
    Menu: {
      activeBarBorderWidth: 4,
      itemHeight: 44,
      horizontalItemSelectedColor: '#4CAF50',
      horizontalItemSelectedBg: '#E8F5E9',
      itemSelectedColor: '#4CAF50',
      itemSelectedBg: '#E8F5E9',
      itemActiveBg: '#E8F5E9',
      itemHoverColor: '#4CAF50',
      itemHoverBg: '#F5F5F5',
      itemColor: '#212121',
      itemBg: 'transparent',
      iconMarginInlineEnd: 12,
      iconSize: 18,
    },
    Button: {
      paddingInlineSM: 20,
      fontWeight: 500,
    },
  },
}
