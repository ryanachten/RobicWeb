import React from "react";
import { withStyles, createStyles, Theme } from "@material-ui/core";
import { MuscleGroup } from "../../constants/types";
import { Classes } from "jss";
import { transparentize } from "../../utils";

const styles = (theme: Theme) => createStyles({});

type Props = {
  className: string;
  classes: Classes;
  selected: MuscleGroup[];
  theme: Theme;
};

const BackBody = ({ className, selected, theme }: Props) => {
  const fill = (muscle?: MuscleGroup) => {
    if (muscle && selected.includes(muscle)) {
      return theme.palette.primary.light;
    }
    return transparentize(theme.palette.text.disabled, 0.1);
  };
  return (
    <div className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.89 1190.55">
        <path
          fill={fill()}
          d="M389.26 264.62c-1-4.7-1.13-9.58-1.87-14.35a6.02 6.02 0 0 0-2.08-3.43c-1.57-1.26-4.32-1.63-5.13-3.14-2.56-4.81-4.9-9.86-6.3-15.09-.4-1.45 2.45-5.01 4.41-5.6 4.03-1.2 4.5-3.36 4.4-6.93-.33-11.95 1.87-23.25 9.85-32.72 7.68-9.09 17.28-13.3 28.14-13.1 10.85-.2 20.45 4.01 28.13 13.1 7.99 9.46 10.19 20.77 9.86 32.71-.1 3.58.37 5.75 4.4 6.94 1.95.59 4.8 4.15 4.41 5.6-1.4 5.23-3.74 10.28-6.3 15.1-.81 1.5-3.56 1.87-5.13 3.13-1 .8-1.89 2.19-2.08 3.43-.75 4.77-.88 9.65-1.88 14.35-.49 2.28-2.39 4.26-3.65 6.37l-1.65-.76c-.66-3.9-1.24-7.83-2.02-11.72-1.32-6.58-3.05-12.92-8.52-17.6-4.1-3.5-9.75-5.4-15.49-5.48H420.6c-5.73.08-11.39 1.97-15.49 5.48-5.46 4.68-7.19 11.02-8.51 17.6-.78 3.89-1.36 7.81-2.03 11.72l-1.65.76c-1.26-2.11-3.16-4.09-3.65-6.37zM247.87 625.5c-3.51 5.01-6.03 10.72-9.05 16.08-.65 1.15-1.32 2.45-2.33 3.2-1.07.8-2.67 2.45-3.86 1.5-1.2-.94-.46-2.8-.01-3.93 1.2-3.1 2.82-6.02 4.15-9.07.34-.8.24-1.8.34-2.7l-1.64-.65c-2.25 4.89-4.44 9.8-6.76 14.64-1.29 2.69-2.41 5.63-4.38 7.75-1.1 1.2-4.36 2.38-5.72 1.37-1.35-1.02-.64-3.58-.05-4.98 2.81-6.57 5.96-13.01 8.97-19.5.6-1.28 1.14-2.57.7-4.36-.86 1.46-1.8 2.88-2.56 4.39-3.39 6.68-6.63 13.44-10.1 20.08-1.4 2.67-3.47 5.82-6.9 4.06-3.5-1.81-1.9-5.08-.47-7.85 3.89-7.55 7.74-15.12 11.58-22.7.72-1.41 1.34-2.89 1.02-4.85-2.46 4.2-4.92 8.4-7.36 12.6-1.42 2.44-2.6 5.07-4.3 7.3-1.27 1.66-3.88 4.3-4.72 3.91-3.44-1.55-1.62-4.6-.52-6.84 3.89-7.92 8.09-15.68 12.05-23.56.82-1.63 1.13-3.53 1.69-5.34-6.87 1.92-12.63 3.78-18.52 5.1-3.98.89-9.45-.98-8.48-4.71.16-.37.2-.61.3-.66 11.24-4.54 18.26-13.9 26.3-22.27 11.07-11.54 25.37-10.63 38.26-2.45 1.27.8 1.86 3.32 2.02 5.11 1.26 14.18-1.3 27.39-9.65 39.33zM380.07 989.98c-.1 8.61-.6 17.23-1.1 25.83-.27 4.3-.53 8.66-1.53 12.82-1.75 7.35-3.38 8.67-11.06 8.77-9.68.13-18.86-.87-24.98-10.31-1.88-2.9-5.92-4.65-9.27-6.3-2.95-1.46-6.35-1.96-9.5-3.04-8.27-2.84-12.89-8.92-12.02-15.68.9-7.04 8.08-13.76 15.82-14.5 3.3-.32 6.65-.05 11.45-.05 10.7.37 10.71.37 15.85-10.82 1.1-2.42 2.06-4.9 3.15-7.34 1.98-4.38 7.4-7.47 12.72-7.18 5.15.29 8.85 3.28 9.57 8.03 1 6.49.98 13.18.9 19.77z"
        />
        <g fill={fill(MuscleGroup.MIDDLE_BACK)}>
          <path d="M418.22 429.03c-6.17-19.48-19.96-34.17-31.2-50.33-8.45-12.13-14.9-24.74-16.98-39.45-.37-2.62-1.14-5.2-1.9-7.76-2.36-7.97-6.85-14.24-15.73-17.8 16.67-6.04 32.56-8.15 48.9-4.23 5.06 1.22 7.98 5.25 9.97 9.83 4.43 10.18 6.97 20.8 7.07 31.96.22 23.97.5 47.95.72 71.93.01 1.93-.34 3.87-.85 5.85z" />
          <path d="M421.82 329.16c-.31 1.16-.61 2.35-1.14 4.43-.54-2.07-.83-3.27-1.14-4.43-4.24-15.99-12.2-25.65-30.53-24.38-4.09.28-8.21.04-13.74.04 4.26-2.6 7.36-4.67 10.63-6.43 6.18-3.31 9.01-8.53 9.52-15.35.57-7.64.93-15.32 2.16-22.85.77-4.75 2.97-9.26 4.52-13.88l2.49.48-2.6 29.65 1.05.45c1.22-8.5 2.72-16.98 3.58-25.53.97-9.8 4.45-13.38 14.06-13.25 9.6-.13 13.08 3.44 14.06 13.25.85 8.55 2.35 17.03 3.57 25.53l1.05-.45-2.6-29.65 2.49-.48c1.56 4.62 3.75 9.13 4.53 13.88 1.22 7.54 1.59 15.22 2.15 22.85.51 6.82 3.34 12.03 9.52 15.35 3.27 1.76 6.37 3.84 10.63 6.43-5.53 0-9.65.24-13.74-.04-18.33-1.27-26.29 8.39-30.52 24.38z" />
          <path d="M423 351.25c.1-11.16 2.64-21.78 7.07-31.96 2-4.57 4.91-8.6 9.98-9.83 16.33-3.92 32.23-1.8 48.9 4.23-8.88 3.56-13.38 9.83-15.74 17.8-.75 2.56-1.52 5.14-1.9 7.76-2.07 14.71-8.52 27.32-16.97 39.45-11.25 16.16-25.03 30.85-31.2 50.33-.51-1.98-.87-3.91-.85-5.85.2-23.98.5-47.95.71-71.93z" />
        </g>
        <g fill={fill(MuscleGroup.GLUTES)}>
          <path d="M415.54 591.17c-7.76 11.78-19.52 18.36-31.88 23.96-5.89 2.66-12.12 4.64-18.3 6.58-7.9 2.47-9.7.9-8.45-7.46 1.54-10.28 2.16-20.44-.29-30.72-1.9-8.03-5.24-14.72-13.04-18.38-4.03-1.9-3.31-4.8-1.9-7.94 6.64-14.78 15.79-26.97 30.8-33.11l10.2-2.62.12-.02c3.9-.49 6.35 1.01 7.46 4.9 5.05 17.7 13.99 33.36 25.11 47.9 4.54 5.93 4.52 10.3.17 16.9zM425.81 591.17c-4.35-6.61-4.37-10.98.17-16.91 11.12-14.54 20.06-30.2 25.11-47.9 1.11-3.89 3.55-5.39 7.46-4.9l.13.02 10.19 2.62c15.02 6.14 24.16 18.33 30.8 33.1 1.41 3.14 2.13 6.06-1.9 7.95-7.8 3.66-11.13 10.35-13.04 18.37-2.45 10.3-1.83 20.45-.29 30.73 1.25 8.36-.54 9.93-8.45 7.45-6.18-1.93-12.41-3.9-18.3-6.57-12.36-5.6-24.12-12.18-31.88-23.96z" />
        </g>
        <path
          fill={fill()}
          d="M503.47 987.52c4.8 0 8.15-.27 11.45.05 7.74.74 14.92 7.46 15.82 14.5.87 6.76-3.74 12.85-12.02 15.68-3.14 1.08-6.55 1.58-9.5 3.04-3.35 1.65-7.39 3.4-9.27 6.3-6.12 9.45-15.3 10.44-24.98 10.31-7.68-.1-9.3-1.42-11.06-8.77-1-4.16-1.26-8.53-1.52-12.82-.51-8.6-1-17.22-1.1-25.83-.08-6.6-.1-13.28.9-19.77.72-4.75 4.41-7.74 9.57-8.03 5.32-.29 10.73 2.8 12.7 7.18 1.1 2.43 2.06 4.92 3.17 7.34 5.13 11.2 5.14 11.19 15.84 10.82z"
        />
        <g fill={fill(MuscleGroup.CALVES)}>
          <path d="M330.17 854.8c-.15-27.66 10.68-51.65 24.8-74.55 2.1-3.4 4.5-3.37 5.5.38a38.1 38.1 0 0 1 1.3 13.18c-2.21 23.87-4.83 47.7-7.25 71.54-.68 6.67-4 9-10.56 7.3-4.82-1.24-8.7-3.65-11.38-7.44-.66-.92-1.98-5.66-1.98-5.66l-.43-4.75zM381.44 899.42L379 909.86c-.6 3.7-1.43 7.36-2.26 11.01-2.91 12.81-4.77 25.58.5 38.28.14.35-.19.9-.37 1.7-6.11-3.22-12.58-3.6-17.43.94-4.2 3.93-6.82 9.55-10.17 14.46 6.1-19.38 1.06-38.04-4.39-57l-2.08-8.77c-2.58-8.54-5.04-17.1-7.49-25.68-1.38-4.84-2.62-9.72-3.93-14.58l1.57-.5c9.44 9.24 10.33 22.1 14.2 33.77l2.91 13.53 3.2 14.75 1.15-.13-2.78-14.72-2.75-13-5.53-24.72c5.34.6 9.65.85 13.85 1.69 1.25.25 2.26 2.04 3.23 3.24 2.8 3.45 5.2 7.28 8.34 10.35 3.89 3.77 8.54 2.13 13.07-.05l-.39 5z" />
          <path d="M390.05 874c-1.6 6.08-5.17 11.75-8.48 17.23-2.26 3.74-5.9 3.7-9.55 1.26-6.74-4.5-9.5-11.33-11.37-18.75-3.25-12.87-1.68-25.92-.59-38.79.98-11.56 3.43-23.02 5.7-34.44 1.17-5.83 4.2-10.87 9.74-13.89 4.63-2.52 5.95-1.82 6.04 3.32.08 4.5.02 9 .02 12.7-1.2 12.31 1.1 23.29 4.9 34.11 4.23 12.09 6.91 24.61 3.59 37.26zM451.3 874c-3.32-12.64-.64-25.16 3.6-37.25 3.8-10.83 6.1-21.8 4.9-34.11 0-3.7-.07-8.2.01-12.7.1-5.14 1.41-5.84 6.04-3.32 5.54 3.02 8.58 8.06 9.74 13.9 2.28 11.4 4.73 22.87 5.7 34.43 1.1 12.87 2.67 25.92-.59 38.8-1.87 7.4-4.63 14.24-11.36 18.74-3.66 2.45-7.3 2.48-9.56-1.26-3.3-5.48-6.88-11.15-8.47-17.22z" />
          <path d="M506.05 884.8c-2.45 8.58-4.9 17.14-7.48 25.68l-2.09 8.77c-5.44 18.96-10.49 37.62-4.39 57-3.34-4.9-5.97-10.53-10.17-14.46-4.85-4.55-11.31-4.16-17.42-.95-.2-.8-.52-1.34-.37-1.69 5.27-12.7 3.4-25.47.5-38.28-.84-3.65-1.67-7.31-2.26-11l-2.46-10.45-.39-5c4.54 2.2 9.18 3.84 13.07.06 3.15-3.07 5.55-6.9 8.34-10.35.97-1.2 1.98-3 3.23-3.24 4.2-.83 8.51-1.1 13.85-1.7l-5.53 24.73-2.75 13-2.78 14.72 1.16.13 3.19-14.75 2.92-13.53c3.86-11.67 4.75-24.53 14.2-33.76l1.56.5c-1.3 4.86-2.55 9.73-3.93 14.57zM511.18 854.8l-.42 4.75s-1.33 4.74-1.98 5.66c-2.69 3.8-6.57 6.2-11.39 7.44-6.55 1.7-9.87-.63-10.55-7.3-2.43-23.85-5.04-47.67-7.26-71.54a38.1 38.1 0 0 1 1.3-13.18c1.01-3.75 3.4-3.78 5.5-.38 14.13 22.9 24.96 46.9 24.8 74.55z" />
        </g>
        <g fill={fill(MuscleGroup.HAMS)}>
          <path d="M340.23 722l-2.15-13.59c-1.18-7.61-2.37-15.22-3.48-22.85-.84-5.81-1.6-11.64-2.38-17.47l-.77-9.84-.1-1.68c-1.7-26.8-2.59-53.6 1.56-80.27.44-2.8 2.16-7.28 3.9-7.6 2.95-.54 6.54 1.3 9.55 2.8a8.22 8.22 0 0 1 3.77 4.49c1.99 6.44 4.81 13 4.93 19.55.17 8.71-1.76 17.48-3.07 26.18-.76 5.01.27 6.58 5.3 6.04a34.3 34.3 0 0 0 6.76-1.65c8.36-2.68 9.47-2.3 9.25 6.65-.4 16.3-1.54 32.58-2.34 48.87-.3 6.22-.56 12.45-.83 18.67l-.79 11.5c-.16 3.3.37 6.73-.13 9.97-.9 5.92-1.23 11.95-2.49 17.79a120.24 120.24 0 0 1-5.16 17.19c-2.12 5.59-4.97 10.9-7.44 16.36-2.45 5.4-4.84 10.83-7.25 16.25l-2.44-.08c-.46-7.02-1.86-14.13-1.2-21.03 1.5-15.67.75-31.05-3-46.25zM376.72 777.95c.37.79-.32 2.6-1.1 3.32-2.39 2.24-5.06 4.18-8.11 6.63-2.28-5.1-4.58-9.36-6.01-13.9-.64-2.03.06-4.76.87-6.9 1.09-2.88 2.87-5.5 4.54-8.56 3.49 6.83 6.78 13.06 9.8 19.41z" />
          <path d="M412.08 682.67l-.67 16.89c-.06 2.16 0 4.33-.06 6.49-.93 33.87-9.48 66.13-20.65 97.83-.92 2.6-2.52 4.97-3.8 7.45l-1.62-.56c0-3.61-.13-7.23.02-10.83.43-10.21-.94-19.43-8.57-27.54a26.6 26.6 0 0 1-7.14-21.22c1.25-11.76 2.6-23.5 3.73-35.27.26-2.65.15-5.32.09-8l.6-11.87c2.15-21.93 4.12-43.88 6.33-65.8.85-8.43 5.76-13.83 13.6-16.98 3.97-1.6 7.62-4.02 11.47-5.95 1.23-.61 2.65-.84 3.98-1.25.42 1.37 1.09 2.71 1.2 4.1.26 3.16.06 6.35.37 9.49 2.1 20.98 2.22 42 1.12 63.02zM450.66 803.88c-11.17-31.7-19.72-63.97-20.66-97.83-.06-2.16 0-4.33-.06-6.5l-.67-16.87c-1.1-21.04-.97-42.05 1.13-63.03.3-3.14.1-6.33.36-9.48.12-1.4.79-2.74 1.2-4.11 1.34.4 2.76.64 3.98 1.25 3.86 1.93 7.5 4.35 11.48 5.95 7.83 3.15 12.74 8.55 13.59 16.98 2.21 21.93 4.19 43.87 6.33 65.8l.6 11.87c-.06 2.68-.16 5.35.09 8 1.13 11.77 2.49 23.51 3.74 35.27a26.6 26.6 0 0 1-7.15 21.22c-7.62 8.11-9 17.33-8.56 27.54.15 3.6.02 7.22.02 10.83l-1.63.56c-1.28-2.48-2.87-4.85-3.8-7.45z" />
          <path d="M474.45 758.54c1.66 3.06 3.44 5.68 4.53 8.55.81 2.15 1.52 4.88.87 6.91-1.43 4.54-3.73 8.8-6 13.9-3.06-2.45-5.73-4.39-8.13-6.63-.77-.72-1.46-2.53-1.08-3.32 3.02-6.35 6.31-12.59 9.8-19.41zM504.54 568.7c1.74.32 3.47 4.8 3.9 7.6 4.15 26.67 3.27 53.47 1.57 80.27l-.1 1.68-.77 9.84c-.78 5.83-1.54 11.66-2.39 17.47-1.1 7.63-2.3 15.24-3.48 22.85L501.12 722c-3.75 15.2-4.5 30.58-3 46.25.66 6.9-.73 14.01-1.2 21.03l-2.43.08c-2.42-5.42-4.8-10.85-7.25-16.25-2.48-5.46-5.32-10.77-7.44-16.36a120.24 120.24 0 0 1-5.17-17.2c-1.26-5.83-1.59-11.86-2.49-17.78-.5-3.23.03-6.67-.13-9.97l-.78-11.5c-.27-6.22-.53-12.44-.84-18.67-.8-16.29-1.94-32.57-2.34-48.87-.22-8.95.9-9.33 9.26-6.65a34.3 34.3 0 0 0 6.76 1.66c5.02.53 6.06-1.04 5.3-6.05-1.32-8.7-3.24-17.47-3.08-26.17.12-6.56 2.94-13.12 4.94-19.56a8.22 8.22 0 0 1 3.77-4.5c3-1.48 6.6-3.33 9.54-2.79z" />
        </g>
        <g fill={fill()}>
          <path d="M349.23 487.73l2.37-4.89.31-.11 3.63 1.56 3.48 4.46 3.28 5.16-14.76 11.92-1.46-.9 3.15-17.2zM338.66 544.8c2.28-9.7 4.13-19.55 7.2-29 2.97-9.1 9.4-15.59 18.87-18.43 7.6-2.29 13.78.7 16.93 8.09.59 1.37 1.07 2.8 1.56 4.2 2.27 6.57 2.82 8.14-.53 10.03l-10.6 2.98c-11.28 2.48-20.4 8.41-26.52 19.34-1.35 2.4-3.46 4.39-6.13 7.7-.48-2.81-1-3.95-.78-4.91zM502.7 544.8c.22.96-.31 2.1-.78 4.91-2.68-3.31-4.79-5.3-6.14-7.7-6.1-10.93-15.23-16.87-26.52-19.34l-10.6-2.98c-3.34-1.89-2.8-3.46-.53-10.03.5-1.4.97-2.83 1.56-4.2 3.15-7.39 9.32-10.38 16.93-8.1 9.48 2.85 15.9 9.34 18.87 18.45 3.08 9.44 4.93 19.29 7.2 28.99zM492.13 487.73l3.14 17.2-1.46.9-14.76-11.92 3.28-5.16 3.48-4.46 3.63-1.56.31.11 2.38 4.9z" />
        </g>
        <g fill={fill(MuscleGroup.LOWER_BACK)}>
          <path d="M418.77 498v68.95l-1.65.63c-2.78-4.4-6.24-8.52-8.2-13.26-4.64-11.22-8.43-22.79-12.8-34.13-4.07-10.56-7.22-21.58-18.55-27.47 0 0-1.8-1.38-2.23-3.47s.1-5.34.1-5.34c2.37-23.58 17.31-39.78 32.85-55.6 2.44-2.5 5-2.28 5.98 1.37 1.66 6.23 3.83 12.52 4.17 18.87.7 12.87.34 25.8.48 38.7l-.15 10.75zM422.91 448.55c.34-6.35 2.52-12.64 4.18-18.87.97-3.64 3.54-3.86 5.98-1.37 15.53 15.83 30.47 32.02 32.85 55.6 0 0 .5 3.26.09 5.34s-2.23 3.47-2.23 3.47c-11.33 5.9-14.47 16.9-18.55 27.48-4.37 11.33-8.16 22.9-12.8 34.13-1.95 4.73-5.42 8.85-8.2 13.25l-1.65-.63V498l-.14-10.75c.14-12.91-.23-25.84.47-38.71z" />
        </g>
        <g fill={fill(MuscleGroup.LATS)}>
          <path d="M340.5 391.92c-1.1-18.22 5.22-33.3 19.27-45.03 1.27-1.06 2.68-2 4.14-2.76 2.36-1.23 4.55-.79 4.94 2.05 2.83 20.56 17.47 34.84 27.32 51.65 3.27 5.6 7.06 10.91 10.64 16.33 2.64 3.98 2.75 7.9-.62 11.4-5.65 5.85-10.98 12.19-17.35 17.15-12.94 10.07-26.58 7.79-36.57-5.34-7.5-9.87-11-21.21-11.73-33.46-.24-3.98-.04-8-.04-12z" />
          <path d="M345.01 429.97c3.36 4.39 6.5 8.84 9.31 13.5 3.47 5.73 8.58 8.31 15.04 8.03 4.72-.2 9.42-1.05 13.77-1.56l-11.62 35.13-1.48 3.94s-.47 2.17-1.44 2.41c-.96.25-2.41-1.43-3-1.65l-3.39-4.11c-11.57-16.82-15.43-35.92-17.19-55.69zM479.15 485.66l-3.39 4.1c-.58.23-2.04 1.9-3 1.66-.97-.25-1.44-2.4-1.44-2.4l-1.47-3.96-11.63-35.12c4.36.51 9.05 1.36 13.78 1.56 6.45.28 11.57-2.3 15.03-8.04 2.8-4.66 5.95-9.1 9.31-13.5-1.76 19.78-5.61 38.88-17.2 55.7z" />
          <path d="M500.82 403.91c-.73 12.25-4.23 23.59-11.74 33.46-9.99 13.13-23.63 15.41-36.57 5.34-6.37-4.96-11.7-11.3-17.34-17.15-3.38-3.5-3.27-7.42-.63-11.4 3.59-5.42 7.37-10.73 10.65-16.33 9.84-16.81 24.48-31.1 27.3-51.65.4-2.84 2.6-3.28 4.95-2.05 1.47.76 2.87 1.7 4.14 2.76 14.06 11.73 20.37 26.8 19.27 45.03 0 4 .2 8-.03 11.99z" />
        </g>
        <g fill={fill(MuscleGroup.SHOULDERS)}>
          <path d="M336.5 363.67c-9.11 8.44-19.87 11.77-32.14 10.81-3.58-.27-5.12-1.97-4.48-5.56 1.01-5.62 2.09-11.24 2.94-16.89l4.26-10.82c7.45-11.95 18.96-18.48 31.48-23.87 5.66-2.44 11.19-2.2 15.33 2.04 3.95 4.04 7.09 9.05 9.73 14.08.84 1.61-.28 5.44-1.8 6.92-8.22 7.99-16.9 15.5-25.31 23.29zM479.54 340.38c-1.52-1.48-2.65-5.3-1.8-6.92 2.63-5.03 5.77-10.04 9.72-14.08 4.15-4.25 9.67-4.48 15.33-2.04 12.52 5.39 24.03 11.92 31.48 23.87l4.26 10.82c.86 5.65 1.93 11.27 2.94 16.9.64 3.59-.9 5.28-4.48 5.56-12.27.95-23.02-2.38-32.15-10.82-8.4-7.8-17.08-15.3-25.3-23.3z" />
        </g>
        <g fill={fill(MuscleGroup.TRICEPS)}>
          <path d="M545.26 379.7c4.9 9 8.3 18.57 8.97 28.84.4 5.88-4.16 8.26-9.32 5.39-14.78-8.24-20.13-23.12-26.79-37.02 8.48.32 16.21.56 23.93 1 1.13.06 2.7.87 3.2 1.8zM287.12 408.54c.68-10.27 4.07-19.83 8.98-28.83.5-.93 2.08-1.73 3.2-1.8 7.72-.44 15.45-.68 23.93-1-6.66 13.9-12 28.77-26.79 37.02-5.15 2.87-9.7.49-9.32-5.39zM315.52 454.38c-4.65 6.78-12.05 6.78-19.4 5.72-.16-.02-.32-.1-.48-.15-12.32-3.3-12.98-3.62-12.75-16.42.12-6.88 1.76-13.77 3.18-20.56a7.6 7.6 0 0 1 3.86-4.74c5.75-2.43 11.76-4.27 18.53-6.64 0 1.9-.14 3.85.03 5.78.28 3.13.3 6.39 1.24 9.33 2.87 8.97 9.82 10.74 16.72 4.53 1.32-1.2 2.6-2.43 3.9-3.65l1.12.77c-5.28 8.7-10.2 17.65-15.95 26.03z" />
          <path d="M334.57 413.69c-1.9 5.56-6.52 10.31-10.41 15.02-1.36 1.64-4.77 3.38-6.18 2.73-1.93-.87-3.61-3.84-4.05-6.16a49.14 49.14 0 0 1 4.4-31.6c3.55-7.08 8.49-13.49 13.06-20.02.9-1.27 2.96-1.73 4.48-2.56.78 1.54 2.12 3.04 2.24 4.64.32 4.14.1 8.32.1 12.49.42.07-.9 17.42-3.64 25.46zM503.14 388.23c0-4.17-.22-8.35.1-12.49.13-1.6 1.46-3.1 2.25-4.64 1.52.83 3.58 1.29 4.47 2.56 4.57 6.53 9.51 12.94 13.06 20.03a49.14 49.14 0 0 1 4.4 31.6c-.43 2.31-2.12 5.28-4.04 6.15-1.41.65-4.83-1.09-6.18-2.73-3.9-4.7-8.51-9.46-10.41-15.02-2.75-8.04-4.06-25.4-3.65-25.46z" />
          <path d="M525.84 454.38c-5.75-8.38-10.68-17.33-15.96-26.03l1.12-.77c1.3 1.22 2.58 2.46 3.9 3.65 6.9 6.21 13.85 4.44 16.72-4.53.94-2.94.96-6.2 1.24-9.33.17-1.92.03-3.88.03-5.78 6.78 2.37 12.78 4.21 18.54 6.64a7.6 7.6 0 0 1 3.85 4.74c1.43 6.79 3.06 13.68 3.18 20.56.23 12.8-.43 13.12-12.75 16.42-.16.05-.31.13-.48.15-7.35 1.06-14.75 1.06-19.4-5.72z" />
        </g>
        <g fill={fill(MuscleGroup.FOREARMS)}>
          <path d="M561.6 447.64l2.3-.38c4.3 7.95 8.67 15.87 12.88 23.87l.66 1.24 2.12 5.8 1.63 12.65-1.38.24-9.54-12.94-4.07-4.3c-2.7-3.76-6.13-7.38-6.97-11.52-.92-4.54 1.45-9.75 2.38-14.66zM261.8 478.17l2.11-5.8c.2-.35.4-.76.66-1.24 4.22-8 8.58-15.92 12.88-23.87l2.3.38c.92 4.91 3.3 10.12 2.38 14.66-.84 4.14-4.28 7.76-6.98 11.53l-4.06 4.29-9.55 12.94-1.38-.24 1.63-12.65zM311.02 478.42l-3.82 6a78.52 78.52 0 0 0-5.51 12.26c-9.63 27.86-24.47 53.23-38.03 79.2-.62 1.2-3.51 2.45-4.58 1.97-7.97-3.58-16.02-6.45-25.85-5.09l19.58-56.58 1.84-.01c2.18 11.35.54 23.03 1.37 34.52.77-2.8 1.32-5.57 1.45-8.37a1598.8 1598.8 0 0 0 1.45-37.78l.8-7.06 12.1-18.3 4.15-3.82c3.47-2.61 7-5.13 10.3-7.93 4.06-3.42 6.34-3.5 11-.22 3.84 2.72 1.76 5.43.34 8.25-.34.66-.56 1.38-.83 2.08l.8.56 14.52-16.98c2.48 6.72.17 11.8-1.08 17.3zM577.7 575.88c-13.56-25.97-28.4-51.34-38.03-79.2a78.52 78.52 0 0 0-5.52-12.27l-3.81-5.99c-1.26-5.5-3.56-10.58-1.08-17.3l14.51 16.98.8-.56c-.27-.7-.49-1.42-.83-2.09-1.42-2.81-3.5-5.52.35-8.24 4.65-3.29 6.94-3.2 10.99.22 3.3 2.8 6.84 5.32 10.3 7.93l4.15 3.81 12.1 18.3.8 7.07c.3 12.6.87 25.2 1.45 37.78.14 2.8.69 5.58 1.46 8.37.83-11.5-.81-23.18 1.37-34.52l1.84.01 19.57 56.58c-9.83-1.36-17.88 1.5-25.85 5.1-1.06.47-3.96-.78-4.58-1.98z" />
        </g>
        <path
          fill={fill()}
          d="M642.23 611.14c-5.89-1.31-11.65-3.17-18.52-5.1.56 1.82.87 3.71 1.69 5.35 3.96 7.88 8.16 15.64 12.05 23.55 1.1 2.24 2.92 5.3-.52 6.85-.84.38-3.45-2.26-4.72-3.91-1.7-2.23-2.88-4.86-4.3-7.3-2.44-4.2-4.9-8.4-7.36-12.6-.32 1.96.3 3.43 1.03 4.86a4355.2 4355.2 0 0 0 11.57 22.68c1.42 2.78 3.03 6.04-.48 7.85-3.42 1.77-5.49-1.38-6.89-4.06-3.47-6.63-6.71-13.39-10.1-20.07-.76-1.51-1.7-2.93-2.57-4.4-.43 1.8.12 3.1.7 4.37 3.02 6.49 6.17 12.92 8.98 19.5.6 1.4 1.3 3.96-.05 4.97-1.36 1.02-4.62-.17-5.72-1.37-1.97-2.11-3.1-5.05-4.38-7.74-2.32-4.84-4.51-9.75-6.76-14.64l-1.64.65c.1.9 0 1.9.34 2.7 1.33 3.04 2.95 5.97 4.15 9.07.45 1.14 1.2 2.98 0 3.93-1.2.95-2.8-.7-3.87-1.5-1-.75-1.68-2.05-2.33-3.2-3.02-5.36-5.54-11.07-9.05-16.08-8.35-11.95-10.91-25.15-9.66-39.33.16-1.8.76-4.31 2.03-5.12 12.89-8.17 27.19-9.08 38.25 2.45 8.05 8.39 15.07 17.74 26.3 22.28.1.04.14.29.3.65.98 3.74-4.5 5.6-8.48 4.72z"
        />
      </svg>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(BackBody);
