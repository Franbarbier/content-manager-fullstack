
export default (state=[], action) => {
    
    switch(action.type){
        case 'FETCH_ALL_PROJECTS':
            return action.payload;   
        case 'CREATE_PROJECT':
            return [action.payload, ...state];
        case 'DELETE_PROJECT':
            var id_deleted = action.payload.id
            return state.filter((projects)=> projects._id != id_deleted);
        default:
            return state;
    }

}