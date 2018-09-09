import React from 'react'

export default ( animated = true ) => (
  <svg className={animated ? 'checkmark' : null}
    width="54px" 
    height="37px" 
    viewBox="0 0 54 37"
    version="1.1" >
    <g id="mobile" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="7" transform="translate(-62.000000, -332.000000)" fill="#FFFFFF">
        <g id="body">
          <g id="content">
            <g id="templates" transform="translate(25.000000, 287.000000)">
              <g id="1">
                <path d="M89,44.25 L89,68 L87.75,68 L87.75,44.25 L39,44.25 L39,43 L89,43 L89,44.25 Z" id="Combined-Shape" transform="translate(64.000000, 55.500000) rotate(-225.000000) translate(-64.000000, -55.500000) "></path>
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
)