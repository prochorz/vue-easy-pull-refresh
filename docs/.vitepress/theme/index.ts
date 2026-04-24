import DefaultTheme from 'vitepress/theme';

import DemoBox from './components/demo-box.vue';
import DemoPair from './components/demo-pair.vue';
import DemoContent from './components/demo-content.vue';
import DemoQueue from './components/demo-queue.vue';
import DemoCarousel from './components/demo-carousel.vue';
import TestContentFetch from './components/test-content-fetch.vue';
import TestPlayground from './components/test-playground.vue';
import {
    VueEasyPullRefresh
} from '../../../src';

export default {
    extends: DefaultTheme,
    enhanceApp({ app }: any) {
        app.component('DemoBox', DemoBox);
        app.component('DemoPair', DemoPair);
        app.component('DemoContent', DemoContent);
        app.component('DemoQueue', DemoQueue);
        app.component('DemoCarousel', DemoCarousel);
        app.component('TestContentFetch', TestContentFetch);
        app.component('TestPlayground', TestPlayground);
        app.component('VueEasyPullRefresh', VueEasyPullRefresh);
    }
}
