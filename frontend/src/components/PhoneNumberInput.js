import * as React from 'react';
import PropTypes from 'prop-types';
import { IMaskInput } from 'react-imask';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';

const TextMaskAdapter = React.forwardRef(function TextMaskAdapter(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(#00) 000-0000"
      definitions={{
        '#': /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

TextMaskAdapter.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

// Updated to accept and propagate the onChange handler
function PhoneNumberInput({ onChange }) {
  const [value, setValue] = React.useState('');

  const handleChange = (event) => {
    setValue(event.target.value); // update local state
    onChange(event); // propagate to parent component if any
  }

  return (
    <FormControl sx={{marginBottom:'1%'}}>
      <FormLabel>Phone Number:</FormLabel>
      <Input
        value={value}
        onChange={handleChange}
        placeholder= "(123) 456-7890"
        slotProps={{ input: { component: TextMaskAdapter } }}
      />
    </FormControl>
  );
}

PhoneNumberInput.propTypes = {
  onChange: PropTypes.func,
};

export default PhoneNumberInput;
