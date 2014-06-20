/*global jQuery, FormExtractor*/

// This is a one-off message listener
chrome.runtime.onMessage.addListener(function (message) {
  // Request to start extracting a form to rules
  if (message && message.action === "showExtractOverlay") {
    var overlays = ["<div class='form-o-fill-overlay-cover'></div>"];
    jQuery("form").each(function(index) {
      var $form = jQuery(this);

      // Add an index so we can find the form later
      $form.attr("data-form-o-fill-id", index);

      // Dimensions
      var offset = $form.offset();
      var height = $form.height();
      var width = $form.width();

      // HTML
      var overlay = "<div data-form-o-fill-id='" + index + "' class='form-o-fill-overlay-form' style='top:" + offset.top + "px; left:" + offset.left + "px; width:" + width + "px; height:" + height + "px;'><div class='form-o-fill-overlay-text'>Form-O-Fill:<br />Click in the colored area to extract this form</div></div>";
      overlays.push(overlay);
    });

    // Add event listener to DOM
    jQuery(document).on("click", ".form-o-fill-overlay-form", function (e) {
      e.preventDefault();
      var targetForm = document.querySelector("form[data-form-o-fill-id='" + this.dataset.formOFillId + "']");
      // cleanup
      jQuery("form").each(function () {
        jQuery(this).removeAttr("form-o-fill-id");
      });
      jQuery(".form-o-fill-overlay-form, .form-o-fill-overlay-cover").remove();

      if(targetForm) {
        // looks good start extraction
        var ruleCode = FormExtractor.extract(targetForm);
        console.log(ruleCode);
      }
    });

    // Attach overlays to DOM
    jQuery("body").append(overlays.join("\n"));
  }
});