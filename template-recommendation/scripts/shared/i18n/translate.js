'use strict'

const DEBUG = 0
let noop = () => {}
if ( DEBUG ) noop = () => console.trace( 'translate' )

noop.exemptFunctionNames = [
  'sl_tr_start',
  'sl_tr_end',
  'sl_tr_json_start',
  'sl_tr_json_end',
  'sl_tr_html_start',
  'sl_tr_html_end',
  'sl_notr_start',
  'sl_notr_end',
]
module.exports = noop