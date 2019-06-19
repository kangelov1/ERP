const initState = {
    isSignedIn:false,
    token:''
}

const authReducer = (state = initState,action)=>{
    if(action.type === 'SET_TOKEN'){
        let newState = {
            isSignedIn:true,
            token:action.token
        }
        return newState
    }
    if(action.type === 'LOG_OUT'){
        let newState = {
            isSignedIn:false,
            token:''
        }
        return newState
    }
    
    return state
}

export default authReducer