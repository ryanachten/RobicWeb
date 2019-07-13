import React from "react";
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  createStyles,
  Theme,
  withStyles
} from "@material-ui/core";
import { Classes } from "jss";

const styles = (theme: Theme) =>
  createStyles({
    select: {
      maxHeight: "200px",
      overflowY: "auto"
    }
  });

interface Option {
  checked: boolean;
  label: string;
  value: string;
}

type Props = {
  classes: Classes;
  className: string;
  label: string;
  options: Option[];
  onChange: (value: any, checked: boolean) => void;
};

const MultiSelect = ({
  classes,
  className,
  label,
  options,
  onChange
}: Props) => (
  <FormControl className={className}>
    <Typography color="textSecondary" variant="caption">
      {label}
    </Typography>
    <div className={classes.select}>
      <FormGroup>
        {options.map(option => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                color="primary"
                checked={option.checked}
                onChange={(e: any, checked: boolean) =>
                  onChange(e.target.value, checked)
                }
                value={option.value}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
    </div>
  </FormControl>
);

const styled = withStyles(styles)(MultiSelect);
export { styled as MultiSelect };
