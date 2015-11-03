const initialState = {
    application: {
        serverData: {
            fetching: {
                status: 'done',
                errorText: '',
                error: false
            },
            list: []
        }
    }
};

export default initialState;
