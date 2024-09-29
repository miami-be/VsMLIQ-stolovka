import { theme } from 'antd'
import { Inter } from 'next/font/google'

const interFont = Inter({
  subsets: ['latin'],
})

export const Theme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // Colors
    colorPrimary: '#1890ff',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorTextBase: '#333333',
    colorLink: '#1890ff',
    colorBgBase: '#f0f2f5',
    colorBgContainer: '#ffffff',
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
    colorSplit: 'rgba(0, 0, 0, 0.06)',
    // Typography
    fontFamily: `${interFont.style.fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial`,
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    linkDecoration: 'none',

    //Form
    controlItemBgActive: '#e6f7ff',
    controlOutline: 'rgba(24, 144, 255, 0.2)',
    controlHeight: 40,
    controlHeightSM: 32,

    // Layout
    padding: 16,
    boxShadow:
      '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
    borderRadius: 4,
    lineType: 'solid',
    lineWidth: 1,
    motion: true,
  },
  components: {
    Form: {
      itemMarginBottom: '24px',
    },

    Layout: {
      headerBg: '#ffffff',
      footerBg: '#f0f2f5',
      bodyBg: '#f0f2f5',
      siderBg: '#ffffff',
    },
    Menu: {
      activeBarBorderWidth: 3,
      itemHeight: 40,
      horizontalItemSelectedColor: '#1890ff',
      horizontalItemSelectedBg: '#e6f7ff',
      itemSelectedColor: '#1890ff',
      itemSelectedBg: '#e6f7ff',
      itemActiveBg: '#e6f7ff',
      itemHoverColor: '#1890ff',
      itemHoverBg: '#f5f5f5',
      itemColor: '#333333',
      itemBg: 'transparent',
      iconMarginInlineEnd: 10,
      iconSize: 16,
    },
    Button: {
      paddingInlineSM: 16,
      fontWeight: 400,
    },
  },
}
