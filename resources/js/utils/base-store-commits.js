export const mixinMutations = () => {
  return {
    setLoadingCommit(state, stateItem) {
      Object.assign(stateItem, {
        loading: true,
        error: false,
      });
    },
    setEndLoading(state, stateItem) {
      Object.assign(stateItem, {
        loading: false,
      });
    },
    setErrorCommit(state, stateItem) {
      Object.assign(stateItem, {
        loading: false,
        error: true,
      });
    },
    setSuccessCommit(state, { stateItem, data }) {
      Object.assign(stateItem, {
        loading: false,
        error: false,
        data,
      });
    },
    setPaginationCommit(state, { stateItem, pagination }) {
      Object.assign(stateItem, { pagination });
    },
    setClearCommit(state, { stateItem, value }) {
      Object.assign(stateItem, { data:value });
    },
  };
};
