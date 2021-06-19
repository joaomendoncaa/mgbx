/**
 * A module with the map for all the elements 
 * in the DOM used in the app
 */
export default {
  //Toolbar upload image Button 
  toolbar_upload_btn: document.querySelector('.toolbar_upload_btn'),
  toolbar_upload_input: document.querySelector('.toolbar_upload_input'),
  //Toolbar save image button
  toolbar_save_btn: document.querySelector('.toolbar_save_btn'),
  //Toolbar crop selection button
  toolbar_clear_btn: document.querySelector('.toolbar_clear_btn'),
  //Crop button
  selection_crop_btn: document.querySelector('.selection_crop_btn'),
  selection_cancel_btn: document.querySelector('.selection_cancel_btn'),
  //Canvas
  image_preview: document.querySelector('.image_preview'),
  selection_tool_mask: document.querySelector('.selection_tool_mask'),
  selection_tool: document.querySelector('.selection_tool'),
  //Header span
  main_header_span: document.querySelector('.main_header_span'),
  main_header_editing: document.querySelector('.main_header_editing'),
  //Presets
  presets_wrapper: document.querySelector('.presets_wrapper'),
  presets_list: document.querySelector('.presets_list'),
  //Effects
  effects_wrapper: document.querySelector('.effects_wrapper'),
  effects_list: document.querySelector('.effects_list'),
  effects_header_reset_btn: document.querySelector('.effects_header_reset_btn'),
}