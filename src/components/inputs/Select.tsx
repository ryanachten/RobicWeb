import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import MuiSelect from "@material-ui/core/Select";

type Option = {
  id: string;
  value: any;
  label: string;
};

type Props = {
  label: string;
  className?: string;
  options: Option[];
  onChange: (e: any) => void;
  value: any;
};

export const Select = ({
  className,
  label,
  options,
  onChange,
  value
}: Props) => (
  <FormControl className={className}>
    <InputLabel htmlFor={label}>{label}</InputLabel>
    <MuiSelect
      onChange={onChange}
      value={value}
      inputProps={{
        name: label,
        id: label
      }}
    >
      {options &&
        options.map((option: Option) => (
          <MenuItem key={option.id} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
    </MuiSelect>
  </FormControl>
);
