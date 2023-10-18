import store from '../store';
import middlewarePipeline from '../utils/middleware-pipeline';
import Router from 'vue-router';

const appRoutes = [];

const router = new Router({
    routes: appRoutes,
    mode: 'history',
    linkActiveClass: 'active',
});

//мидлвары для проверки доступов и авторизации
router.beforeEach(async (to, from, next) => {
    if (!to?.meta?.middleware?.length) {
        return next();
    }
    const middleware = to.meta.middleware;
    const context = {
        to,
        from,
        next,
        store,
    };
    return middleware[0]({
        ...context,
        next: middlewarePipeline(context, middleware, 1),
    });
});

export default router;
