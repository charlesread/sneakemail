CKEDITOR.replace('html');

function isValidJSON(jsonString) {
  if (!jsonString) {
    jsonString = $('#passthrough').val();
  }
  var isValid = true;
  try {
    JSON.parse(jsonString);
  } catch (e) {
    isValid = false
  }
  return isValid
}

$('#passthrough').keyup(function() {
  if (isValidJSON($(this).val())) {
    $(this).addClass('green');
    $(this).removeClass('red');
  } else {
    $(this).addClass('red');
    $(this).removeClass('green');
  }
});