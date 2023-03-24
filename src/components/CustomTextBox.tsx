import { TextValidator} from 'react-material-ui-form-validator';
import React from 'react';

type _moduleInfo = {    
    id?: string;
    value?: string;  
    required?: boolean;
    label?: string;
    fullWidth?: boolean;
    variant?: "standard" | "filled" | "outlined" | undefined; 
    onChange?: (e: any, key?: string, name?: string) => void;
    index?: string;
    name?: string;
    type?: string;
    validators?: any; 
    multiline?: boolean;
    rows?: number;
}

const CustomTextBox = (props: Partial<_moduleInfo>) => { 
    const { onChange, ...propsRest} = props
    return (
        <TextValidator {...propsRest} onChange={(e) => onChange ? onChange(e, props.index, props.type) : null}  />
    )
};

export default React.memo(CustomTextBox);