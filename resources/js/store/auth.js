import Vue from 'vue';
import Api from "@/api/ApiClient.js";
import {mixinMutations} from "@/utils/base-store-commits.js";

export default {
    namespaced: true,

    state: () => ({
            user: {
                authorize: {
                    loading: false,
                    error: false,
                    data: null,
                },
                checked: false,
            },
        }
    ),
    getters: {
        checked: state => state.user.checked,
        authorizedUserInfo: state => state.user.authorize?.data?.user || null,
        isAuthorized: state => !!state.user.authorize?.data?.user?.id,
        settingEmail: state => state.user.authorize?.data?.setting?.notification?.channel?.email,
        userPermissions: state => state.user.authorize?.data?.user?.permissions || [],
        /**
         *
         * @param state
         * @returns {function(permission:string): boolean}
         */
        userIs: state =>
            role =>
                (state?.user?.authorize?.data?.user?.roles?.map(role => role.code) || []
                ).includes(role),
        /**
         *
         * @param state
         * @returns {function(permission:string): boolean}
         */
        userCan: state =>
            permission =>
                (state.user.authorize?.data?.user?.permissions || []
                ).includes(permission),
    },
    mutations: {
        ...mixinMutations(),
        setUserEmailSetting(state, bool) {
            state.user.authorize.data.setting.notification.channel.email = bool;
        },
        setChecked(state, bool) {
            state.user.checked = bool;
        },
    },
    actions: {
        /** @param commit
         @param state
         @param {{email: string, password: string}} payload*/
        async authAuthorize({commit, state}, payload) {
            try {
                commit('setLoadingCommit', state.user.authorize);
                const response = await Api.authAuthorize(payload);
                const content = response.getContent();

                commit('setSuccessCommit', {stateItem: state.user.authorize, data: content});
                return content;
            } catch (e) {
                commit('setErrorCommit', state.user.authorize);
                throw e;
            }
        },
        async authLogout({commit, state}) {
            try {
                await Api.authLogout();
            }
                // eslint-disable-next-line no-empty
            catch (e) {
            }
            Vue.$cookies.remove('access_token');
            Vue.$cookies.remove('refresh_token');
            commit('setSuccessCommit', {stateItem: state.user.authorize, data: null});
        },

        async authCheckAuth({commit, state}) {
            try {
                let response = await Api.authCheckAuth();
                let content = response.getContent();

                commit('setSuccessCommit', {stateItem: state.user.authorize, data: content});

                return true;
            } catch (error) {
                return false;
            } finally {
                commit('setChecked', true);
            }
        },

    },
};
