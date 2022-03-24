import React from "react";
import MuiCheckbox from '@mui/material/Checkbox';

const Checkbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <MuiCheckbox ref={resolvedRef} {...rest} />
      </>
    )
  }
)

export default Checkbox;