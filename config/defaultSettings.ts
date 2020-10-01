import {Settings as LayoutSettings} from '@ant-design/pro-layout';

export default {
    navTheme: 'light',
    // 拂晓蓝
    primaryColor: '#1890ff',
    layout: 'mix',
    contentWidth: 'Fluid',
    fixedHeader: false,
    fixSiderbar: true,
    colorWeak: false,
    menu: {
        locale: true,
    },
    title: 'Multi-Mode Route Recommendation',
    pwa: false,
    logo: '../white_mmrr_icon.svg',
    iconfontUrl: '',
} as LayoutSettings & {
    pwa: boolean;
};
