import DefaultTheme from 'vitepress/theme';

import TestFetch from './components/test-fetch.vue';
import TestScreen from './components/test-screen.vue';
import TestContentFetch from './components/test-content-fetch.vue';
import {
    VueEasyPullRefresh
} from '../../../src';

export default {
    extends: DefaultTheme,
    enhanceApp({ app }: any) {
        app.component('TestFetch', TestFetch);
        app.component('TestScreen', TestScreen);
        app.component('TestContentFetch', TestContentFetch);
        app.component('VueEasyPullRefresh', VueEasyPullRefresh);
    }
}