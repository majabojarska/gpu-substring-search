import React, { useState } from "react";
import { NativeSelect, FormControl } from "@material-ui/core";
import "./ModePicker.scss";

const CountryPicker: React.FC = () => {
  const [modes, setmodes] = useState(["Sekwencyjny GPU", "Równoległy GPU"])

  return (
    <FormControl className='formControl'>
      <NativeSelect
        defaultValue=""
        variant="filled"
      >
        {modes.map((country) => (
          <option value={country}>{country}</option>
        ))}
      </NativeSelect>
    </FormControl>
  );
};
export default CountryPicker;
