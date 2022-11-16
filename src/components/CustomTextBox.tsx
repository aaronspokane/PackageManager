import TextField from "@mui/material/TextField";

type _moduleInfo = {    
    id?: string;
    value?: string;  
    required?: boolean;
    label?: string;
    fullWidth?: boolean;
    variant?: "standard" | "filled" | "outlined" | undefined; 
    onChange?: (e: any, key: string, name: string) => void;
    index?: string;
    name?: string;
    type?: string;
}

const CustomTextBox = ({id, name, required, label, fullWidth, value, index = "-1", variant, type, onChange}: _moduleInfo) => {
    return (
        <TextField
            id={id}
            required={required}            
            name={name}
            label={label}
            fullWidth={fullWidth}            
            value={value}
            onChange={(e) => onChange ? onChange(e, index, type || "") : null} 
            variant={variant}
        />
    )
};

export default CustomTextBox;