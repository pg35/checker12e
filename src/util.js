export function doAjax(args) {
  window.ajaxUrl = "http://goodtogo.cc/wp-admin/admin-ajax.php";
  /*if (args.data instanceof FormData) {
    args.data.set("imran", 1);
  } else args.data = { ...args.data, imran: 1 };
  */
  return window.jQuery.ajax(window.ajaxUrl, args);
}
