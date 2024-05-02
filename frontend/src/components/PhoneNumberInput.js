import * as React from 'react';
import PropTypes from 'prop-types';
import { IMaskInput } from 'react-imask';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';

/**
 * TextMaskAdapter is a component that adapts the input field to accept masked input for phone numbers.
 * It uses IMaskInput to apply the phone number mask.
 * @param {Object} props - The props object containing the properties.
 * @param {string} props.name - The name of the input field.
 * @param {function} props.onChange - The function to call when the input value changes.
 */
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

/**
 * PhoneNumberInput is a component for inputting phone numbers with a masked input field.
 * It wraps the TextMaskAdapter component and provides the phone number input functionality.
 * @param {Object} props - The props object containing the properties.
 * @param {function} props.onChange - The function to call when the phone number value changes.
 */
function PhoneNumberInput({ onChange }) {
  const [value, setValue] = React.useState('');

   /**
   * Handles the change event of the input field.
   * @param {Object} event - The event object containing information about the input change.
   */
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
