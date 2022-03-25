import React from "react";
import MuiCheckbox from '@mui/material/Checkbox';

const Checkbox = React.forwardRef(
  ({ indeterminate, onChange, checked,...rest }, ref) => {
    const [checkedState, setChecked] = React.useState(checked)
    // const defaultRef = React.useRef()
    // const resolvedRef = ref || defaultRef

    // React.useEffect(() => {
    //   resolvedRef.current.indeterminate = indeterminate
    // }, [resolvedRef, indeterminate]);

    const handleChange = (e) => {
      onChange(e.target.checked);
    }

    React.useEffect(() => {
      setChecked(checked);
    }, [checked]);

    return (
      <>
        {/* <MuiCheckbox ref={resolvedRef} {...rest} checked={checkedState} onChange={handleChange} /> */}
        <input
          type="checkbox"
          onChange={handleChange}
          disabled={rest?.disabled}
          defaultChecked={checkedState}
        />
      </>
    )
  }
)

export default Checkbox;