import _ from 'lodash';

export function getComponentProps(options){
    const { props, api } = options;
    let result = '';
    if(props && !_.isEmpty(props)){
        result += ' ';
        _.forOwn(props, (value, prop) => {
            if(_.isArray(value)){
                result += prop + '={ ' + api.getPropValue({ value, api }) + ' } ';
            } else if(_.isObject(value)){
                if(value['type']){
                    result += prop +"={ " + api.getChildComponent({ model: value, api }) + '} ';
                } else {
                    result += prop + "={ " + api.getPropValue({ value, api }) +  ' } ';
                }
            } else if (_.isString(value) && value.length > 0) {
                result += prop + "=" + api.getPropValue({value, api}) + ' ';
            } else if (_.isBoolean(value) || _.isNumber(value)) {
                result += prop + "={" + api.getPropValue({value, api}) + '} ';
            }
        });
    }
    return result;
}

export function getPropValue(options){
    const { value, prop, api } = options;
    let result = '';
    if(value !== 'undefined'){
        if(_.isString(value) && value.length > 0){
            if(prop){
                result += '"' + prop + '": ';
            }
            result += '"' + value + '",';
        } else if(_.isBoolean(value) || _.isNumber(value)){
            if(prop){
                result += '"' + prop + '": ';
            }
            result += value + ',';
        } else if(_.isArray(value) && value.length > 0){
            if(prop){
                result += '"' + prop + '": ';
            }
            result += '[';
            value.forEach( item => {
                result += api.getPropValue({ value: item, api }) + ',';
            });
            result = result.substr(0, result.length - 1);
            result += '],';
        } else if(_.isObject(value) && !_.isEmpty(value)){
            if(prop){
                result += '"' + prop + '": ';
            }
            result += '{';
            _.forOwn(value, (objValue, objProp) => {
                result += api.getPropValue({ value: objValue, prop: objProp, api }) + ',';
            });
            result = result.substr(0, result.length - 1);
            result += '},';
        }
        result = result.substr(0, result.length - 1);
    }
    return result;
}

