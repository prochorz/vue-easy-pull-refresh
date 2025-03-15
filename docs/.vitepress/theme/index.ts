import DefaultTheme from 'vitepress/theme';

import TestScreen from './components/test-screen.vue';
import TestScreenFetch from './components/test-screen-fetch.vue';
import TestContentFetch from './components/test-content-fetch.vue';
import {
    VueEasyPullRefresh
} from '../../../src';

export default {
    extends: DefaultTheme,
    enhanceApp({ app }: any) {
        app.component('TestScreen', TestScreen);
        app.component('TestScreenFetch', TestScreenFetch);
        app.component('TestContentFetch', TestContentFetch);
        app.component('VueEasyPullRefresh', VueEasyPullRefresh);
    }
}