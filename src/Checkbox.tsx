import React from "react";
import styled from "styled-components";

// export default function Checkbox({ className, checked, ...props }) {
//   return (
//     <div class="checkbox">
//       <input type="checkbox" id="checkbox_1" />
//       <label for="checkbox_1">Pure CSS Checkbox</label>
//     </div>
//   );
// }

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const StyledCheckbox = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  background: ${props => (true ? "salmon" : "papayawhip")};
  border-radius: 3px;
  transition: all 150ms;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  /* // Hide checkbox visually but remain accessible to screen readers.
  // Source: 
https://polished.js.org/docs/#hidevisually   */
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;
