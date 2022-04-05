
export default (state=[], action) => {
    
    switch(action.type){
        case 'FETCH_ALL_PROJECTS':
            return action.payload;   
        case 'CREATE_PROJECT':
            return [action.payload, ...state];     
        default:
            return state;
    }

}