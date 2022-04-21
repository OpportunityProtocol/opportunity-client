import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    InputLabel,
    MenuItem,
    FormControl,
    NativeSelect,
    InputBase
} from '@mui/material'

import { FunctionComponent } from 'react';

const SelectInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ddd',
    fontSize: 16,
    height: 20,
    padding: '10px 26px 15px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#4CAF50',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}));


interface ISelectProps {
    label?: string,
    placeholder: string,
    width?: number,
    options?: Array<JSX.Element>,
    onShowCustomContent?: React.MouseEventHandler,
    isCustomContent?: boolean,
    CustomContentComponent?: React.ReactElement
}

const Select : FunctionComponent<ISelectProps> = ({ 
    label, 
    placeholder, 
    width , 
    options=[], 
}) => {
  const [age, setAge] = React.useState('');
  const handleChange = (event: { target: { value: string } }) => {
    setAge(event.target.value);
  };
  
  return (
    <div>
      <FormControl variant="standard">
       
        <NativeSelect 
          id="demo-customized-select-native"
          value={age}
          onChange={handleChange}
          input={<SelectInput />}
          sx={{ width }}
        >
            <option aria-label="None" value="">
              {placeholder}
            </option>
            {
                options.map(option => option)
            }
        </NativeSelect>
      </FormControl>
    </div>
  );
}

export default Select