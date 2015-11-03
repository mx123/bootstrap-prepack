
export default store => next => action => {
    //console.log('In my middleware: ' + action.type);
    return next(action);
}

