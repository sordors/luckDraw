const state = {
	data: null
};

const mutations  = {
	ADD_USER(state, data) {
		state.data = data;
	}
};

const actions = {
	addUserInfo({ commit }, val) {
		return new Promise(resolve => {
			commit('ADD_USER',val);
			resolve(val)
		})
	}
};

export default {
	state,
	mutations,
	actions
}