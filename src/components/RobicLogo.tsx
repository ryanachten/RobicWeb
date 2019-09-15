import React from "react";
import { withStyles, createStyles } from "@material-ui/styles";
import { Classes } from "jss";
import classnames from "../utils";

type Props = {
  className?: string;
  classes: Classes;
};

const styles = () =>
  createStyles({
    root: {
      display: "flex",
      height: "39px",
      width: "80px"
    }
  });

const RobicLogo = ({ className, classes }: Props) => (
  <div className={classnames(classes.root, className)}>
    <svg
      width="149px"
      height="48px"
      viewBox="0 0 149 48"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs />
      <g
        id="Symbols"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g id="logo/logotype" transform="translate(-4.000000, -14.000000)">
          <g id="Group-2" transform="translate(4.000000, 14.000000)">
            <path
              d="M8.98750007,35.46875 L8.98750007,42.59375 C8.98750007,44.3229253 8.58125413,45.6197873 7.76875007,46.484375 C6.95624601,47.3489627 5.92500632,47.78125 4.67500007,47.78125 C3.44582726,47.78125 2.4354207,47.3437544 1.64375007,46.46875 C0.852079447,45.5937456 0.456250072,44.3020919 0.456250072,42.59375 L0.456250072,18.84375 C0.456250072,15.0103975 1.84165288,13.09375 4.61250007,13.09375 C6.02917382,13.09375 7.04999695,13.5416622 7.67500007,14.4375 C8.3000032,15.3333378 8.64374976,16.6562413 8.70625007,18.40625 C9.72708851,16.6562413 10.773953,15.3333378 11.8468751,14.4375 C12.9197971,13.5416622 14.3520744,13.09375 16.1437501,13.09375 C17.9354257,13.09375 19.6749916,13.5416622 21.3625001,14.4375 C23.0500085,15.3333378 23.8937501,16.5208259 23.8937501,18 C23.8937501,19.0416719 23.5343787,19.9010383 22.8156251,20.578125 C22.0968715,21.2552117 21.3208376,21.59375 20.4875001,21.59375 C20.1749985,21.59375 19.4197977,21.4010436 18.2218751,21.015625 C17.0239524,20.6302064 15.9666713,20.4375 15.0500001,20.4375 C13.7999938,20.4375 12.7791707,20.7656217 11.9875001,21.421875 C11.1958294,22.0781283 10.5812523,23.0520769 10.1437501,24.34375 C9.70624788,25.6354231 9.40416757,27.1718661 9.23750007,28.953125 C9.07083257,30.7343839 8.98750007,32.9062372 8.98750007,35.46875 Z M57.08,30.4375 C57.08,32.9791794 56.6841707,35.3229059 55.8925,37.46875 C55.1008294,39.6145941 53.9550075,41.4583256 52.455,43 C50.9549925,44.5416744 49.1633438,45.7239542 47.08,46.546875 C44.9966563,47.3697958 42.6529297,47.78125 40.04875,47.78125 C37.4654038,47.78125 35.1425104,47.3645875 33.08,46.53125 C31.0174897,45.6979125 29.2310493,44.5052161 27.720625,42.953125 C26.2102008,41.4010339 25.0643789,39.5677189 24.283125,37.453125 C23.5018711,35.3385311 23.11125,33.0000128 23.11125,30.4375 C23.11125,27.8541538 23.5070794,25.4895941 24.29875,23.34375 C25.0904207,21.1979059 26.225826,19.3645909 27.705,17.84375 C29.1841741,16.3229091 30.9758229,15.1510458 33.08,14.328125 C35.1841772,13.5052042 37.5070707,13.09375 40.04875,13.09375 C42.6320963,13.09375 44.9758229,13.5104125 47.08,14.34375 C49.1841772,15.1770875 50.9862425,16.3645756 52.48625,17.90625 C53.9862575,19.4479244 55.1268711,21.2812394 55.908125,23.40625 C56.6893789,25.5312606 57.08,27.8749872 57.08,30.4375 Z M48.5175,30.4375 C48.5175,26.9583159 47.7518827,24.2500097 46.220625,22.3125 C44.6893674,20.3749903 42.6320963,19.40625 40.04875,19.40625 C38.382075,19.40625 36.9133397,19.8385373 35.6425,20.703125 C34.3716604,21.5677127 33.3925035,22.8437416 32.705,24.53125 C32.0174966,26.2187584 31.67375,28.1874887 31.67375,30.4375 C31.67375,32.6666778 32.0122883,34.614575 32.689375,36.28125 C33.3664618,37.947925 34.3352021,39.2239539 35.595625,40.109375 C36.856048,40.9947961 38.3404082,41.4375 40.04875,41.4375 C42.6320963,41.4375 44.6893674,40.4635514 46.220625,38.515625 C47.7518827,36.5676986 48.5175,33.8750172 48.5175,30.4375 Z M70.70375,5.28125 L70.70375,18.3125 C72.3079247,16.645825 73.943325,15.3697961 75.61,14.484375 C77.276675,13.5989539 79.3391544,13.15625 81.7975,13.15625 C84.6308475,13.15625 87.1151977,13.8281183 89.250625,15.171875 C91.3860524,16.5156317 93.0422858,18.4635289 94.219375,21.015625 C95.3964642,23.5677211 95.985,26.5937325 95.985,30.09375 C95.985,32.6770962 95.6568783,35.0468642 95.000625,37.203125 C94.3443717,39.3593858 93.3912563,41.2291587 92.14125,42.8125 C90.8912438,44.3958413 89.3756339,45.6197873 87.594375,46.484375 C85.8131161,47.3489627 83.8495941,47.78125 81.70375,47.78125 C80.3912435,47.78125 79.1568808,47.6250016 78.000625,47.3125 C76.8443692,46.9999984 75.8600041,46.5885442 75.0475,46.078125 C74.234996,45.5677058 73.5422945,45.0416694 72.969375,44.5 C72.3964555,43.9583306 71.6412547,43.1458387 70.70375,42.0625 L70.70375,42.90625 C70.70375,44.5104247 70.3183372,45.7239542 69.5475,46.546875 C68.7766628,47.3697958 67.797506,47.78125 66.61,47.78125 C65.4016606,47.78125 64.4381286,47.3697958 63.719375,46.546875 C63.0006214,45.7239542 62.64125,44.5104247 62.64125,42.90625 L62.64125,5.65625 C62.64125,3.92707469 62.9902049,2.61979609 63.688125,1.734375 C64.3860452,0.848953906 65.3599938,0.40625 66.61,0.40625 C67.9225066,0.40625 68.9329131,0.828120781 69.64125,1.671875 C70.3495869,2.51562922 70.70375,3.71874219 70.70375,5.28125 Z M71.11,30.625 C71.11,34.0208503 71.8860339,36.6301992 73.438125,38.453125 C74.9902161,40.2760508 77.0266541,41.1875 79.5475,41.1875 C81.6933441,41.1875 83.5422839,40.2552177 85.094375,38.390625 C86.6464661,36.5260323 87.4225,33.8541841 87.4225,30.375 C87.4225,28.1249887 87.0995866,26.1875081 86.45375,24.5625 C85.8079135,22.9374919 84.891256,21.6822961 83.70375,20.796875 C82.5162441,19.9114539 81.1308413,19.46875 79.5475,19.46875 C77.9224919,19.46875 76.4745897,19.9114539 75.20375,20.796875 C73.9329103,21.6822961 72.9329203,22.9635333 72.20375,24.640625 C71.4745797,26.3177167 71.11,28.3124884 71.11,30.625 Z M110.39,17.9375 L110.39,42.59375 C110.39,44.3020919 109.983754,45.5937456 109.17125,46.46875 C108.358746,47.3437544 107.327506,47.78125 106.0775,47.78125 C104.827494,47.78125 103.811879,47.3333378 103.030625,46.4375 C102.249371,45.5416622 101.85875,44.260425 101.85875,42.59375 L101.85875,18.1875 C101.85875,16.4999916 102.249371,15.2291709 103.030625,14.375 C103.811879,13.5208291 104.827494,13.09375 106.0775,13.09375 C107.327506,13.09375 108.358746,13.5208291 109.17125,14.375 C109.983754,15.2291709 110.39,16.4166591 110.39,17.9375 Z M148.82625,37.21875 C148.82625,38.2812553 148.508545,39.4166606 147.873125,40.625 C147.237705,41.8333394 146.268965,42.9843695 144.966875,44.078125 C143.664785,45.1718805 142.024177,46.05208 140.045,46.71875 C138.065823,47.38542 135.836679,47.71875 133.3575,47.71875 C128.08664,47.71875 123.972098,46.182307 121.01375,43.109375 C118.055402,40.036443 116.57625,35.9166925 116.57625,30.75 C116.57625,27.2499825 117.253327,24.1562634 118.6075,21.46875 C119.961673,18.7812366 121.919987,16.7031323 124.4825,15.234375 C127.045013,13.7656177 130.107482,13.03125 133.67,13.03125 C135.878344,13.03125 137.904366,13.3541634 139.748125,14 C141.591884,14.6458366 143.154369,15.4791616 144.435625,16.5 C145.716881,17.5208384 146.696038,18.6093692 147.373125,19.765625 C148.050212,20.9218808 148.38875,21.999995 148.38875,23 C148.38875,24.0208384 148.008545,24.8854131 147.248125,25.59375 C146.487704,26.3020869 145.565839,26.65625 144.4825,26.65625 C143.774163,26.65625 143.185627,26.4739602 142.716875,26.109375 C142.248123,25.7447898 141.722086,25.1562541 141.13875,24.34375 C140.097078,22.7604087 139.008547,21.5729206 137.873125,20.78125 C136.737703,19.9895794 135.295009,19.59375 133.545,19.59375 C131.024154,19.59375 128.992924,20.5781152 127.45125,22.546875 C125.909576,24.5156348 125.13875,27.2083162 125.13875,30.625 C125.13875,32.2291747 125.336665,33.7031183 125.7325,35.046875 C126.128335,36.3906317 126.701246,37.5364536 127.45125,38.484375 C128.201254,39.4322964 129.107495,40.1510392 130.17,40.640625 C131.232505,41.1302108 132.39916,41.375 133.67,41.375 C135.378342,41.375 136.841869,40.9791706 138.060625,40.1875 C139.279381,39.3958294 140.357495,38.1875081 141.295,36.5625 C141.815836,35.6041619 142.37833,34.8541694 142.9825,34.3125 C143.58667,33.7708306 144.326246,33.5 145.20125,33.5 C146.242922,33.5 147.107497,33.8958294 147.795,34.6875 C148.482503,35.4791706 148.82625,36.3229122 148.82625,37.21875 Z"
              id="robic-copy"
              fill="#8050D0"
            />
            <path
              d="M106.17125,9.125 C104.983744,9.125 103.968129,8.76042031 103.124375,8.03125 C102.280621,7.30207969 101.85875,6.27084 101.85875,4.9375 C101.85875,3.72916063 102.291037,2.73437891 103.155625,1.953125 C104.020213,1.17187109 105.025411,0.78125 106.17125,0.78125 C107.275422,0.78125 108.254579,1.13541312 109.10875,1.84375 C109.962921,2.55208688 110.39,3.58332656 110.39,4.9375 C110.39,6.25000656 109.973337,7.27603797 109.14,8.015625 C108.306662,8.75521203 107.317089,9.125 106.17125,9.125 Z"
              id="Path"
              fill="#FF9800"
            />
          </g>
        </g>
      </g>
    </svg>
  </div>
);

const styled = withStyles(styles)(RobicLogo);
export { styled as RobicLogo };
